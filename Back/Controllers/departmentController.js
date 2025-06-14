const Department = require("../Models/department");
const AppError = require("../Utils/AppError");
const { CatchAsync } = require("../Utils/CatchAsync");

exports.getAllDepartments = CatchAsync(async (req, res, next) => {
  const departments = await Department.find();
  res.status(200).json(departments);
});

exports.getDepartment = CatchAsync(async (req, res, next) => {
  const department = await Department.findById(req.params.id);
  if (!department) return next(new AppError(404, "Department not found"));
  res.status(200).json(department);
});

exports.createDepartment = CatchAsync(async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(new AppError(400, "Name is required"));
  const newDep = await Department.create({ name });
  res.status(201).json(newDep);
});

exports.updateDepartment = CatchAsync(async (req, res, next) => {
  const { name } = req.body;
  const updated = await Department.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  if (!updated) return next(new AppError(404, "Department not found"));
  res.status(200).json(updated);
});

exports.deleteDepartment = CatchAsync(async (req, res, next) => {
  const deleted = await Department.findByIdAndDelete(req.params.id);
  if (!deleted) return next(new AppError(404, "Department not found"));
  res.status(200).json({ message: "Deleted successfully" });
});
