// searchRoutes.js
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        // Initialize query object
        let query = {};

        // Add name filter using regex if provided
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" };
        }

        // Add category filter if provided
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Add condition filter if provided
        if (req.query.condition) {
            query.condition = req.query.condition;
        }

        // Add age_days filter if provided
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        const gifts = await collection.find(query).toArray();
        res.json(gifts);
    } catch (e) {
        console.error('Error searching gifts:', e);
        res.status(500).send('Error searching gifts');
    }
});

module.exports = router;
