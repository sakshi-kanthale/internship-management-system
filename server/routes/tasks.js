const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const dbPath = path.join(__dirname, '../db.json');
const getDb = () => JSON.parse(fs.readFileSync(dbPath));
const saveDb = (data) => fs.writeFileSync(dbPath, JSON.stringify(data));

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all tasks
router.get('/', auth, (req, res) => {
  const db = getDb();
  const tasks = db.tasks.filter(t => t.userId === req.user.id);
  res.json(tasks);
});

// Add task
router.post('/', auth, (req, res) => {
  const db = getDb();
  const newTask = {
    id: Date.now().toString(),
    userId: req.user.id,
    title: req.body.title,
    description: req.body.description,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  db.tasks.push(newTask);
  saveDb(db);
  res.status(201).json(newTask);
});

// Update task
router.put('/:id', auth, (req, res) => {
  const db = getDb();
  const index = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
  if (index === -1) return res.status(404).json({ message: 'Task not found' });
  db.tasks[index] = { ...db.tasks[index], ...req.body };
  saveDb(db);
  res.json(db.tasks[index]);
});

// Delete task
router.delete('/:id', auth, (req, res) => {
  const db = getDb();
  db.tasks = db.tasks.filter(t => !(t.id === req.params.id && t.userId === req.user.id));
  saveDb(db);
  res.json({ message: 'Task deleted' });
});

module.exports = router;