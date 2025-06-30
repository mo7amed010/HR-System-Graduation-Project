const mongoose = require("mongoose");

const genralSettingSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ["money", "hours"],
      required: [true, "Method is required"],
    },
    add: {
      type: Number,
      required: [true, "Addition is required"],
    },
    deduct: {
      type: Number,
      required: [true, "deduction is required"],
    },
    offDay1: {
      type: String,
      required: [true, "Day of week is required"],
    },
    offDay2: {
      type: String,
    },
  },
  { timestamps: true }
);

const genralSettingModel = mongoose.model(
  "GeneralSetting",
  genralSettingSchema
);
module.exports = genralSettingModel;
