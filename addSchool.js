// addSchool.js
const express = require('express');
const pool = require('./config/db'); // Import the database pool

const router = express.Router();

// Add School Endpoint
router.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validate input data
  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, address, latitude, longitude]
    );

    res.status(201).json({ message: 'School added successfully', school: result.rows[0] });
  } catch (err) {
    console.error('Error adding school:', err);
    res.status(500).json({ error: 'Failed to add school' });
  }
});

module.exports = router;
