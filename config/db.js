// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: 'localhost',     
  user: 'postgres',   
  password: '092003', 
  port: 5432,            
  database: 'postgres',  
});

module.ex