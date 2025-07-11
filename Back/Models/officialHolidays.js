const mongoose = require("mongoose");

const officialHolidaysSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    type: {
      type: String,
      enum: ["عطلة دينية", "عطلة وطنية", "عطلة رسمية"],
      required: [true, "Holiday type is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 day"],
    },
  },
  { timestamps: true }
);

const officialHolidaysModel = mongoose.model(
  "officialHolidays",
  officialHolidaysSchema
);
module.exports = officialHolidaysModel;
