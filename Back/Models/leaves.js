const mongoose = require("mongoose");

const leavesSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "employee",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["annual", "sick", "emergency", "other"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "admin",
    },
  },
  { timestamps: true }
);

const LeavesModel = mongoose.model("leaves", leavesSchema);
module.exports = LeavesModel; 