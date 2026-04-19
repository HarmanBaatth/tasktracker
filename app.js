const express = require('express');
const app = express();
const authRoutes = require('./auth');
const taskRoutes = require('./tasks');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

module.exports = app;
