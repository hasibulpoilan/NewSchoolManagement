const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

// Initialize Express
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'school_management',
    password: '092003',
    port: 3000,
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the School Management API!');
});

// Add School API
app.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Input validation
    if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, address, latitude, longitude]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting school:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;
    
    // Log the incoming request
    console.log('Received request with query:', req.query);

    // Validate latitude and longitude
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        // Execute the SQL query to find schools and calculate distances
        const result = await pool.query(`
            SELECT id, name, address, latitude, longitude,
              (6371 * acos(
                cos(radians($1)) * cos(radians(latitude)) * 
                cos(radians(longitude) - radians($2)) + 
                sin(radians($1)) * sin(radians(latitude))
              )) AS distance
            FROM schools
            ORDER BY distance
        `, [latitude, longitude]);

        // Log the result of the query
        console.log('Query result:', result.rows);

        // Send the result back to the client
        res.status(200).json(result.rows);
    } catch (err) {
        // Log any errors that occur
        console.error('Error retrieving schools:', err);
        res.status(500).json({ error: 'Failed to retrieve schools' });
    }
});

app.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, address, latitude, longitude]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding school:', err);
        res.status(500).json({ error: 'Failed to add school' });
    }
});

app.put('/updateSchool/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, latitude, longitude } = req.body;
    try {
        const result = await pool.query(
            'UPDATE schools SET name = $1, address = $2, latitude = $3, longitude = $4 WHERE id = $5 RETURNING *',
            [name, address, latitude, longitude, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating school:', err);
        res.status(500).json({ error: 'Failed to update school' });
    }
});

app.delete('/deleteSchool/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM schools WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting school:', err);
        res.status(500).json({ error: 'Failed to delete school' });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
