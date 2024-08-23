// routes/schoolRoutes.js
const express = require('express');
const { addSchool } = require('../controllers/schoolController');

const router = express.Router();

// Route to add a new school
router.post('/addSchool', addSchool);

module.exports = router;
