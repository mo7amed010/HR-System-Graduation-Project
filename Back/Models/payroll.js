const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "employee",
    required: true,
  },
  month: {
    type: String, // format: YYYY-MM
    required: true,
  },
  baseSalary: Number,
  workingDays: Number,
  attendedDays: Number,
  totalAdditions: Number,
  totalDeductions: Number,
  netSalary: Number,
});

const payrollModel = mongoose.model("payroll", payrollSchema);
module.exports = payrollModel;
