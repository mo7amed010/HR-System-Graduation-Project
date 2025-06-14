const mongoose = require("mongoose");
const { CatchAsync } = require("../Utils/CatchAsync");
const AppError = require("../Utils/AppError");
const employee=require('../Models/employee');

exports.getAll = CatchAsync(async (req, res, next) => {
  const employees = await employee.find();

  res.status(200).json({
    status: "suc",
    data: employees,
  });
});


exports.getById = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(400, "المعرف غير صحيحة"));
  }
  const emp = await employee.findById(id);
  if (!emp) {
    return next(new AppError(404, " غير موجود"));
  }
  res.status(200).json({
    status: "suc",
    data: emp,
  });
});

exports.addEmployee = CatchAsync(async (req, res, next) => {
  const newEmployee = new employee(req.body);
  await newEmployee.save();

  res.status(201).json({
    message: 'added',
    employee: newEmployee,
  });
});

 

exports.updateEmployee = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(400, "المعرف غير صحيح"));
  }
  const updatedEmployee = await employee.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedEmployee) {
    return next(new AppError(404, "غير موجود"));
  }
  res.status(200).json({
    message: "update",
    employee: updatedEmployee,
  });
});

exports.deleteEmployee = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(400, "المعرف غير صحيح"));
  }
  const deleted = await employee.findByIdAndDelete(id);
  if (!deleted) {
    return next(new AppError(404, "غير موجود"));
  }
  res.status(200).json({
    message: "delete",
  });
});

 
