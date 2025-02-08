const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();
const db = new sqlite3.Database("./db_main.db");

router.get("/units", (req, res) => {
    db.all("SELECT * FROM units", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get("/tasks", (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post("/tasks", (req, res) => {
    const { unit_id, task } = req.body;

    db.run("DELETE FROM tasks WHERE unit_id = ?", [unit_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });

        db.run("INSERT INTO tasks (unit_id, task, status) VALUES (?, ?, 'pending')",
            [unit_id, task], 
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id: this.lastID, unit_id, task, status: 'pending' });
            }
        );
    });
});

router.put("/tasks/:id/complete", (req, res) => {
    db.run("UPDATE tasks SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?", 
        [req.params.id], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Task completed", task_id: req.params.id });
        }
    );
});

router.delete("/tasks/:unit_id", (req, res) => {
    db.run("DELETE FROM tasks WHERE unit_id = ?", [req.params.unit_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task removed", unit_id: req.params.unit_id });
    });
});

module.exports = router;
