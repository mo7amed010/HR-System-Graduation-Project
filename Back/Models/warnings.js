const mongoose = require("mongoose");

const warningsSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["attendance", "performance", "behavior", "other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    issuedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "admin",
      required: true,
    },
    acknowledged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const WarningsModel = mongoose.model("warnings", warningsSchema);
module.exports = WarningsModel; 