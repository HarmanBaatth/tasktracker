const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('./db');
const SECRET = "mysecretkey";

// Middleware to check token
function auth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: "No token" });
  const token = header.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// ➕ Add task
router.post('/', auth, (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  db.run(
    "INSERT INTO tasks (userId, title, description, dueDate, priority, status) VALUES (?, ?, ?, ?, ?, ?)",
    [req.user.id, title, description, dueDate, priority, "pending"]
  );
  res.json({ message: "Task added" });
});

// 👀 View tasks with due date logic
router.get('/', auth, (req, res) => {
  db.all("SELECT * FROM tasks WHERE userId = ?", [req.user.id], (err, rows) => {
    const today = new Date();

    const updated = rows.map(task => {
      const due = new Date(task.dueDate);
      const diffDays = (today - due) / (1000 * 60 * 60 * 24); // difference in days

      if (task.status === "completed") {
        task.state = "completed";
      } else if (diffDays > 0 && diffDays <= 3) {
        task.state = "resubmission"; // within 3-day grace period
      } else if (diffDays > 3) {
        task.state = "overdue";
      } else {
        task.state = "pending";
      }

      return task;
    });

    res.json(updated);
  });
});

// ✏️ Update task
router.put('/:id', auth, (req, res) => {
  const { status } = req.body;
  db.run(
    "UPDATE tasks SET status=? WHERE id=? AND userId=?",
    [status, req.params.id, req.user.id]
  );
  res.json({ message: "Task updated" });
});

// ❌ Delete task
router.delete('/:id', auth, (req, res) => {
  db.run("DELETE FROM tasks WHERE id=? AND userId=?", [req.params.id, req.user.id]);
  res.json({ message: "Task deleted" });
});

// 📊 Metrics endpoint
router.get('/metrics', auth, (req, res) => {
  db.all("SELECT * FROM tasks WHERE userId = ?", [req.user.id], (err, rows) => {
    let pending = 0, completed = 0, overdue = 0, resubmission = 0;
    const today = new Date();

    rows.forEach(task => {
      const due = new Date(task.dueDate);
      const diffDays = (today - due) / (1000 * 60 * 60 * 24);

      if (task.status === "completed") {
        completed++;
      } else if (diffDays > 0 && diffDays <= 3) {
        resubmission++;
      } else if (diffDays > 3) {
        overdue++;
      } else {
        pending++;
      }
    });

    res.json({
      total: rows.length,
      pending,
      completed,
      overdue,
      resubmission
    });
  });
});

module.exports = router;
