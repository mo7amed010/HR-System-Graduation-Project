const mongoose = require("mongoose");

const weeklyHolidaysSchema = new mongoose.Schema(
  {
    offDay1: {
      type: String,
      required: [true, "Day of week is required"],
    },
    offDay2: {
      type: String,
      required: [true, "Day of week is required"],
    },
  },
  { timestamps: true }
);

const weeklyHolidaysModel = mongoose.model(
  "weeklyHolidays",
  weeklyHolidaysSchema
);
module.exports = weeklyHolidaysModel;
