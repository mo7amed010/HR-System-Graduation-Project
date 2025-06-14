
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AppError = require("./Utils/AppError");

// const dashboardRouter = require("./routes/dashboardRouter");
const departmentRouter = require("./Routers/departmentRouter");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/HR")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// app.use("/dashboard", dashboardRouter);
app.use("/api/departments", departmentRouter);

app.use((req, res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: "fail",
    message: err.message || "Oops, something went wrong",
  });
});

app.listen(3003, () => {
  console.log("Server is running on port 3003...");
});

