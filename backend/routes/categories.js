const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all categories
router.get('/', (req, res) => {
    const sql = "SELECT * FROM categories";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

module.exports = router;
