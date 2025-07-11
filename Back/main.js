const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AppError = require("./Utils/AppError");
const dashboardRouter = require("./Routers/dashboard");
const holidayRouter = require("./Routers/holidayRoutes");
const departmentRouter = require("./Routers/departmentRouter");
const employeeRouter = require("./Routers/employee");
const adminRoutes = require("./Routers/adminRoutes");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/HR")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", dashboardRouter);
app.use("/api/holidays", holidayRouter);
app.use("/api/departments", departmentRouter);
app.use("/employee", employeeRouter);
app.use("/admins", adminRoutes); // Mount the adminRoutes router

// Handle 404 errors
app.use(function (req, res, next) {
  next(new AppError(404, "Route not found"));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ status: "fail", message: err.message || "ops, something wrong" });
});

app.listen(3003, () => {
  console.log("server is working...");
});