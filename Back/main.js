const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AppError = require('./Utils/AppError');
//const dashboardRouter = require('./Routers/dashboard');
const holidayRouter = require('./Routers/holidayRoutes');

dotenv.config();
console.log('SECRET_KEY from .env:', process.env.SECRET_KEY);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/HR')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
//app.use('/dashboard', dashboardRouter);
app.use('/api/holidays', holidayRouter);

// Handle undefined routes
app.use('*', (req, res, next) => {
  next(new AppError(404, 'Route not found'));
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: 'fail',
    message: err.message || 'Oops, something went wrong',
  });
});
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});