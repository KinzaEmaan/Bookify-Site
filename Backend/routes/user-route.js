// Import necessary modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize Express router
const router = express.Router();

// Connect to the database file
const dbPath = path.resolve(__dirname, './database.sqlite');
const db = new sqlite3.Database(dbPath);

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body; // Change username to email

  // Check if the email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Query the database to check if the user exists
  db.get(
    'SELECT * FROM users WHERE email = ? AND password = ?', // Change username to email
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error.' });
      }
      if (!row) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      // User authenticated successfully
      res.status(200).json({ message: 'Login successful.', user: row });
    }
  );
});

// Export the router
module.exports = router;
