const Admin = require("../Models/admin");
const AppError = require("../Utils/AppError");

exports.addAdmin = async (req, res, next) => {
  const { username, fullName, email, password } = req.body;
  const existing = await Admin.findOne({ email });
  if (existing)
    return next(new AppError("البريد الإلكتروني مستخدم بالفعل", 400));
  const admin = await Admin.create({ username, fullName, email, password });
  res.status(201).json({ status: "success", data: admin });
};
exports.getAllAdmins = async (req, res, next) => {
  const admins = await Admin.find();
  res.status(200).json({ status: "success", results: admins.length, data: admins });
};
exports.getAdminById = async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) return next(new AppError("الأدمن غير موجود", 404));
  res.status(200).json({ status: "success", data: admin });
};
exports.deleteAdmin = async (req, res, next) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) return next(new AppError("الأدمن غير موجود", 404));
  res.status(204).json({ status: "success", data: null });
};
exports.updateAdmin = async (req, res, next) => {
  const allowedUpdates = ["username", "fullName", "email", "password"];
  const updates = {};
  for (const key of allowedUpdates) {
    if (req.body[key]) updates[key] = req.body[key];
  }

  const admin = await Admin.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!admin) return next(new AppError("الأدمن غير موجود", 404));
  res.status(200).json({ status: "success", data: admin });
};
exports.searchAdmins = async (req, res, next) => {
  const { name } = req.query;
  const admins = await Admin.find({
    $or: [
      { fullName: new RegExp(name, "i") },
      { username: new RegExp(name, "i") },
    ],
  });
  res.status(200).json({ status: "success", results: admins.length, data: admins });
};



