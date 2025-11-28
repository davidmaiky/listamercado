const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all items
router.get('/', (req, res) => {
    const sql = `
        SELECT items.*, categories.name as category_name, categories.color as category_color 
        FROM items 
        LEFT JOIN categories ON items.category_id = categories.id
        ORDER BY items.purchased ASC, items.created_at DESC
    `;
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

// Create a new item
router.post('/', (req, res) => {
    const { name, category_id, quantity, unit } = req.body;
    const sql = 'INSERT INTO items (name, category_id, quantity, unit) VALUES (?,?,?,?)';
    const params = [name, category_id, quantity, unit];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, ...req.body, purchased: 0 }
        });
    });
});

// Update an item
router.put('/:id', (req, res) => {
    const { name, category_id, quantity, unit, purchased } = req.body;
    const sql = `UPDATE items SET 
        name = COALESCE(?, name), 
        category_id = COALESCE(?, category_id), 
        quantity = COALESCE(?, quantity), 
        unit = COALESCE(?, unit), 
        purchased = COALESCE(?, purchased) 
        WHERE id = ?`;
    const params = [name, category_id, quantity, unit, purchased, req.params.id];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "changes": this.changes
        });
    });
});

// Delete an item
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM items WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "deleted", changes: this.changes });
    });
});

module.exports = router;
