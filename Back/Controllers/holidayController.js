const Holiday = require("../Models/officialHolidays");
const { CatchAsync } = require("../Utils/CatchAsync");
const AppError = require("../Utils/AppError");

// Add new holiday
exports.createHoliday = async (req, res, next) => {
  console.log("createHoliday called with body:", req.body);
  const holiday = await Holiday.create(req.body);
  return res.status(201).json({ success: true, data: holiday });
};

// Get all holidays
exports.getHolidays = async (req, res, next) => {
  const holidays = await Holiday.find().sort({ date: 1 });
  return res.status(200).json({ success: true, data: holidays });
};
// Get holidays by id
exports.getHolidayById = async (req, res, next) => {
  console.log("getHolidayById called with ID:", req.params.id);
  const holiday = await Holiday.findById(req.params.id);
  console.log("Found holiday:", holiday);
  if (!holiday) {
    console.log("No holiday found for ID:", req.params.id);
    return next(new AppError(404, "Holiday not found"));
  }
  return res.status(200).json({ success: true, data: holiday });
};
// Update holiday
exports.updateHoliday = async (req, res, next) => {
  const holiday = await Holiday.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!holiday) {
    return next(new AppError(404, "Holiday not found"));
  }

  return res.status(200).json({ success: true, data: holiday });
};

// Delete holiday
exports.deleteHoliday = async (req, res, next) => {
  const holiday = await Holiday.findByIdAndDelete(req.params.id);
  if (!holiday) {
    return next(new AppError(404, "Holiday not found"));
  }
  return res.status(200).json({ success: true, message: "Holiday deleted" });
};
