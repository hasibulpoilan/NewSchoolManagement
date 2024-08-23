// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: 'localhost',     
  user: 'postgres',   
  password: '092003', 
  port: 3000,            
  database: 'postgres',  
});

module.ex