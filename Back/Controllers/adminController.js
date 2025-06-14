const Admin = require('../Models/admin');
const CatchAsync = require('../Utils/CatchAsync');
const AppError = require('../Utils/AppError');

exports.addAdmin = CatchAsync(async (req, res, next) => {
  const { username, fullName, email, password } = req.body;
 
  const existing = await Admin.findOne({ email });
  if (existing) return next(new AppError('البريد الإلكتروني مستخدم بالفعل', 400));
  const admin = await Admin.create({ username, fullName, email, password });
  res.status(201).json({ status: 'success', data: admin });
});
