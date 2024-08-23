const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',       // your PostgreSQL username
    host: 'localhost',      // your PostgreSQL host
    database: 'postgres',   // default database
    password: '092003',     // your PostgreSQL password
    port: 3000,             // default PostgreSQL port
});

const initDatabase = async () => {
    try {
        // Create a new database
        await pool.query('CREATE DATABASE school_management');
        console.log('Database "school_management" created successfully.');
    } catch (error) {
        if (error.code === '42P04') {
            console.log('Database "school_management" already exists.');
        } else {
            console.error('Error creating database:', error);
            return;
        }
    }

    // Connect to the newly created database
    const newPool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'school_management', // newly created database
        password: '092003',
        port: 3000,
    });

    try {
        // Create a table
        await newPool.query(`
            CREATE TABLE IF NOT EXISTS schools (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                address VARCHAR(255),
                latitude FLOAT,
                longitude FLOAT
            )
        `);
        console.log('Table "schools" created successfully.');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        newPool.end();
    }
};

initDatabase();
