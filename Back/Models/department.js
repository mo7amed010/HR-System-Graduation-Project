
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Department name is required"],
    trim: true,
  },
});

const department = mongoose.model("department", departmentSchema);
module.exports = department;
