const mongoose = require("mongoose");
const { CatchAsync } = require("../Utils/CatchAsync");
const AppError = require("../Utils/AppError");
const employee=require('../Models/employee');
 

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
    return next(new AppError(400, "المعرف غير صالح"));
  }
  const updatedEmployee = await employee.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedEmployee) {
    return next(new AppError(404, "لم يتم العثور "));
  }
  res.status(200).json({
    message: "update",
    employee: updatedEmployee,
  });
});

exports.deleteEmployee = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(400, "المعرف غير صالح"));
  }
  const deleted = await employee.findByIdAndDelete(id);
  if (!deleted) {
    return next(new AppError(404, "لم يتم العثور"));
  }
  res.status(200).json({
    message: "delete",
  });
});

 
