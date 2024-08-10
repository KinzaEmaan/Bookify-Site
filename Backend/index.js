import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";
import fs from 'fs';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path'; 
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(session({
  secret: 'getaway', 
  resave: false,
  saveUninitialized: false,
}));

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend's URL
  credentials: true, // Allow cookies to be sent with requests
};

// Custom CORS middleware function
const customCorsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOptions.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify allowed methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Specify allowed headers
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};

app.use(customCorsMiddleware);
app.use(cors(corsOptions));



const dbPath = './database.sqlite';

const initializeDatabase = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        reset_token TEXT
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT,
        description TEXT,
        file_path TEXT NOT NULL,
        image_path TEXT
      )
    `);

    console.log('Database tables created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initializeDatabase();

// Signup route
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const existingUser = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare the provided password with the hashed password from the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.status(200).json({ message: 'Login successful.' });
    } else {
      res.status(401).json({ error: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Forgot password route
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex'); // Example: Generate a 6-character OTP
    await db.run(
      'UPDATE users SET reset_token = ? WHERE email = ?',
      [otp, email]
    );

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_MAIL,
        pass: process.env.MY_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MY_MAIL,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ error: 'Error sending OTP.' });
      }
      console.log('OTP sent:', info.response);
      return res.status(200).json({ message: 'OTP sent successfully.', redirectTo: '/otp-input' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required.' });
  }

  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Log the received email and OTP for debugging
    console.log('Received email:', email);
    console.log('Received OTP:', otp);

    // Convert OTP array to a string 
    const otpString = Array.isArray(otp) ? otp.join('') : otp;

    // Log the converted OTP string
    console.log('Converted OTP string:', otpString);

    // Fetch the user by email
    const userByEmail = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!userByEmail) {
      console.log('Email not found:', email);
      return res.status(404).json({ error: 'Email not found.' });
    }
    
    // Log the user details retrieved by email
    console.log('User found by email:', userByEmail);

    // Fetch the user by email and OTP
    const userByOtp = await db.get('SELECT * FROM users WHERE email = ? AND reset_token = ?', [email, otpString]);
    if (!userByOtp) {
      console.log('Invalid OTP for email:', email);
      return res.status(401).json({ error: 'Invalid OTP.' });
    }

    // Log the user details retrieved by email and OTP
    console.log('User found by email and OTP:', userByOtp);

    // Clear the OTP column in the database after successful OTP verification
    await db.run('UPDATE users SET reset_token = NULL WHERE email = ?', [email]);

    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});



// Books route
app.get('/api/books', async (req, res) => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const books = await db.all('SELECT * FROM books');
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// Logout route
app.post('/api/logout', (req, res) => {
  if (req.session.user) {
    // Clear session data
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ message: 'Logout failed' });
      } else {
        res.status(200).json({ message: 'Logout successful' });
      }
    });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

// Reset password route
app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required.' });
  }

  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password in the database
    await db.run('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


const currentFileUrl = new URL(import.meta.url);


const __dirname = path.dirname(currentFileUrl.pathname);

const booksDir = path.join(__dirname, 'Frontend', 'books', 'books');


app.get('/api/books/download/:filePath(*)', (req, res) => {
  try {
    const filePath = req.params.filePath;
    console.log(`Received request to download file: ${filePath}`);
    
    const fileLocation = path.join(__dirname, '..', 'Frontend', 'books', 'books', filePath);
    console.log(`File location resolved to: ${fileLocation}`);
    
    res.download(fileLocation, (err) => {
      if (err) {
        console.error('Error during file download:', err);
        res.status(500).send('Error downloading the file');
      } else {
        console.log(`File downloaded successfully: ${filePath}`);
      }
    });
  } catch (error) {
    console.error('Error in download route:', error);
    res.status(500).send('Internal server error');
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
