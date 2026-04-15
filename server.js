console.log("Server file started...");
const express = require("express");
// const mysql = require("mysql2"); // MySQL (planned)
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL-style config (for appearance)
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "lost_found"
};

// SQLite actual DB
const db = new sqlite3.Database("lost_found.db", (err) => {
    if (err) console.log(err);
    else console.log("Connected to DB ✅");
});

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS lost_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT,
    description TEXT,
    location TEXT
)
`);

// Test route
app.get("/", (req, res) => {
    res.send("Server running 🚀");
});

// CREATE
app.post("/addLost", (req, res) => {
    const { item, description, location } = req.body;

    db.run(
        "INSERT INTO lost_items (item_name, description, location) VALUES (?, ?, ?)",
        [item, description, location],
        function (err) {
            if (err) return res.send(err);
            res.send("Item added");
        }
    );
});

// READ
app.get("/getLostItems", (req, res) => {
    db.all("SELECT * FROM lost_items", [], (err, rows) => {
        if (err) return res.send(err);
        res.json(rows);
    });
});

// UPDATE
app.put("/updateLost/:id", (req, res) => {
    const { id } = req.params;
    const { item, description, location } = req.body;

    db.run(
        "UPDATE lost_items SET item_name=?, description=?, location=? WHERE id=?",
        [item, description, location, id],
        function (err) {
            if (err) return res.send(err);
            res.send("Updated");
        }
    );
});

// DELETE
app.delete("/deleteLost/:id", (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM lost_items WHERE id=?", [id], function (err) {
        if (err) return res.send(err);
        res.send("Deleted");
    });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000 🚀");
});

