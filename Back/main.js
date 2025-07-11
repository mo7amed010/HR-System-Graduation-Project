const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AppError = require("./Utils/AppError");
const dashboardRouter = require("./Routers/dashboard");
const holidayRouter = require("./Routers/holidayRoutes");
const departmentRouter = require("./Routers/departmentRouter");
const employeeRouter = require("./Routers/employee");
const attendanceRoutes = require("./Routers/attendance.routes");
const salaryAdjustmentsRoutes = require("./Routers/salaryAdjustments.routes");
const genralSettingRouter = require("./Routers/genralSetting");
const payrollRoutes = require("./Routers/dynamicSalary");
const adminRoutes = require("./Routers/adminRoutes");
const summaryRoutes = require("./Routers/summaryRoutes");
const chatbotRoutes = require("./Routers/chatbot.router");
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

app.use("/", dashboardRouter);
app.use("/api/holidays", holidayRouter);
app.use("/api/departments", departmentRouter);
app.use("/employee", employeeRouter);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary-adjustments", salaryAdjustmentsRoutes);
app.use("/generalSetting", genralSettingRouter);
app.use("/admins", adminRoutes);
app.use("/dynamicSalary", payrollRoutes);
app.use("/employees", summaryRoutes);
app.use("/chatbot", chatbotRoutes);

app.use(function (req, res, next) {
  next(new AppError(404, "Route not found"));
});

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ status: "fail", message: err.message || "ops, something wrong" });
});
