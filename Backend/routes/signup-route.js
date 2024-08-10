import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; 

const router = express.Router();

// Connect to the database file
const dbPath = './database.sqlite'; 

// Connect to SQLite database
const dbPromise = open({
  filename: dbPath,
  driver: sqlite3.Database,
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body; 

  // Check if all required fields are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' }); 
  }

  try {
    
    const db = await dbPromise;

    
    const existingUser = await db.get(
      'SELECT * FROM users WHERE email = ?', // Change username to email
      [email]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    
    await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)', 
      [email, password]
    );

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
