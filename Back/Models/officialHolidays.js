const mongoose = require("mongoose");

const officialHolidaysSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

const officialHolidaysModel = mongoose.model(
  "officialHolidays",
  officialHolidaysSchema
);
module.exports = officialHolidaysModel;
