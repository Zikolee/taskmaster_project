const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db.js');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);


// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, 'Frontend')));

// Fallback route for the frontend (catch-all route for SPA)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', '404.html'));
});

// Fallback for undefined routes (404 handler)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'Frontend', '404.html'));
});



// Start server
//const PORT = process.env.PORT || 5000;
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
