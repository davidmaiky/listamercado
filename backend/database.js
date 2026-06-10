const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH
    ? path.resolve(process.env.DB_PATH)
    : path.resolve(__dirname, 'market.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    // Create Categories Table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT
    )`);

    // Create Items Table
    db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category_id INTEGER,
        quantity REAL DEFAULT 1,
        unit TEXT,
        purchased INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )`);

    // Seed default categories if empty
    db.get("SELECT count(*) as count FROM categories", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO categories (name, color) VALUES (?, ?)");
            stmt.run("Frutas e Verduras", "#4CAF50");
            stmt.run("Carnes e Frios", "#F44336");
            stmt.run("Padaria", "#FF9800");
            stmt.run("Bebidas", "#2196F3");
            stmt.run("Limpeza", "#607D8B");
            stmt.run("Outros", "#9E9E9E");
            stmt.finalize();
            console.log("Default categories inserted.");
        }
    });
});

module.exports = db;
