const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
//mongodb String
const DB = "mongodb+srv://isaacolaniyi63:adventure63@cluster0.ia2li.mongodb.net/"

// Middleware
app.use(cors({
  origin: '*', // Frontend URL during development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies

// Import routes
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Define routes
app.use(userRoutes); // User authentication and registration
app.use('/api/tasks', taskRoutes); // Task management routes

//mongo db
  mongoose.connect(DB).then(()=>{
  console.log('mongodb connected');
  });

// MongoDB connection
//const connectDB = async () => {
  //try {
    //if (!process.env.MONGO_URI) {
      //throw new Error('MONGO_URI is not defined in the .env file');
    //}
    //await mongoose.connect(process.env.MONGO_URI); // No additional options required
    //console.log('✅ Connected to MongoDB');
  //} catch (err) {
    //console.error('❌ MongoDB connection failed:', err.message);
    //process.exit(1); // Exit process on failure
  //}
//};

// Call the connection function
//connectDB();

// Root endpoint
app.get('/', (req, res) => {
  res.send('TaskMaster API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
//const PORT = process.env.PORT || 5000;
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
