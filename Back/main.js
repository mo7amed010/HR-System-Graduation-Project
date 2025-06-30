const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AppError = require("./Utils/AppError");
const dashboardRouter = require("./Routers/dashboard");
const attendanceRoutes = require("./Routers/attendance.routes");
const salaryAdjustmentsRoutes = require("./Routers/salaryAdjustments.routes");

const app = express();

dotenv.config();

app.listen(3003, () => {
  console.log("server is working...");
});

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

app.use("/dashboard", dashboardRouter);

//attendance routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary-adjustments", salaryAdjustmentsRoutes);

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ status: "fail", message: err.message || "ops, something wrong" });
});

app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});
