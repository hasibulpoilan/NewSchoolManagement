// controllers/schoolController.js
const pool = require('../config/db');

// Function to add a new school
const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validate input
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, address, latitude, longitude]
    );

    res.status(201).json({ message: 'School added successfully', school: result.rows[0] });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addSchool,
};
