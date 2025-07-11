const mongoose = require("mongoose");
const { CatchAsync } = require("../Utils/CatchAsync");
const AppError = require("../Utils/AppError");
const genralSetting = require("../Models/GeneralSitting");


exports.updateAll = CatchAsync(async (req, res, next) => {
  const settings = req.body;
  if (typeof settings !== "object" || Array.isArray(settings)) {
    return res
      .status(400)
      .json({ message: "must be  object" });
  }
  const updated = await genralSetting.findOneAndUpdate(
    {},  
    { $set: settings },
    { new: true, upsert: true }
  );

  res.status(200).json({ data: updated });
});

exports.getAll = CatchAsync(async (req, res, next) => {
  const settings = await genralSetting.find();
  if (!settings || settings.length === 0) {
    return next(new AppError(404, " لا توجد  "));
  }
  res.status(200).json({
    status: "suc",
    data: settings,
  });
});
