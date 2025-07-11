const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const departmentModel = mongoose.model("department", departmentSchema);
module.exports = departmentModel;
