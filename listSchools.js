// listSchools.js
const express = require('express');
const pool = require('./config/db');

const router = express.Router();

// List Schools Endpoint
router.get('/listSchools', async (req, res) => {
  const { latitude, longitude } = req.query;

  // Validate input data
  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, name, address, latitude, longitude,
        (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )) AS distance
      FROM schools
      ORDER BY distance
      `,
      [latitude, longitude]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error retrieving schools:', err);
    res.status(500).json({ error: 'Failed to retrieve schools' });
  }
});

module.exports = router;
