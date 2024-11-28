// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const urlRoutes = require('./routes/urlRoutes');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/db');
const urlController = require('./controllers/urlController'); // Import the urlController

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Redirect Route - Place this before other routes
app.get('/:shortCode', urlController.redirectToOriginalUrl);

// Routes
app.use('/api/v1', urlRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;