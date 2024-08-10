
const express = require('express');
const router = express.Router();

// Logout route
router.post('/logout', (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ message: 'Logout failed' });
    } else {
      res.status(200).json({ message: 'Logout successful' });
    }
  });
});

module.exports = router;
