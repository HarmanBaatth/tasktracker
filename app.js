const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const tasks = require('./tasks');
const auth = require('./auth');
const db = require('./db');

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
app.use('/tasks', tasks);
app.use('/auth', auth);

// Health check
app.get('/', (req, res) => {
  res.send('TaskTracker API is running');
});

module.exports = app;
