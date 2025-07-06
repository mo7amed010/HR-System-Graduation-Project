const { body, validationResult } = require("express-validator");
const Admin = require("../Models/admin");

// ✅ فاليديشن للإضافة
const adminValidationRules = [
  body("username")
    .notEmpty().withMessage("اسم المستخدم مطلوب")
    .isLength({ min: 3, max: 20 }).withMessage("اسم المستخدم يجب أن يكون بين 3 و20 حرف")
    .matches(/^[A-Za-z][A-Za-z0-9_]*$/).withMessage("اسم المستخدم يجب أن يبدأ بحرف ويحتوي فقط على أحرف وأرقام وشرطات سفلية"),

  body("fullName")
    .notEmpty().withMessage("الاسم بالكامل مطلوب")
    .isLength({ min: 5, max: 50 }).withMessage("الاسم بالكامل يجب أن يكون بين 5 و50 حرف")
    .matches(/^[\u0621-\u064A\u0660-\u0669A-Za-z\s]+$/).withMessage("الاسم بالكامل يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),

  body("email")
    .notEmpty().withMessage("البريد الإلكتروني مطلوب")
    .isEmail().withMessage("صيغة البريد الإلكتروني غير صحيحة")
    .custom(async (email) => {
      const existing = await Admin.findOne({ email });
      if (existing) throw new Error("البريد الإلكتروني مستخدم بالفعل");
      return true;
    }),

  body("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 8 }).withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .matches(/[A-Z]/).withMessage("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .matches(/[a-z]/).withMessage("كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .matches(/[0-9]/).withMessage("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
    .matches(/[^A-Za-z0-9]/).withMessage("كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"),

  body("passwordConfirm")
    .notEmpty().withMessage("تأكيد كلمة المرور مطلوب")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("كلمتا المرور غير متطابقتين");
      }
      return true;
    }),
];

const validateAdmin = async (req, res, next) => {
  await Promise.all(adminValidationRules.map((rule) => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const updateAdminValidationRules = [
  body("username")
    .optional()
    .isLength({ min: 3, max: 20 }).withMessage("اسم المستخدم يجب أن يكون بين 3 و20 حرف")
    .matches(/^[A-Za-z][A-Za-z0-9_]*$/).withMessage("اسم المستخدم يجب أن يبدأ بحرف ويحتوي فقط على أحرف وأرقام وشرطات سفلية"),

  body("fullName")
    .optional()
    .isLength({ min: 5, max: 50 }).withMessage("الاسم بالكامل يجب أن يكون بين 5 و50 حرف")
    .matches(/^[\u0621-\u064A\u0660-\u0669A-Za-z\s]+$/).withMessage("الاسم بالكامل يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),

  body("email")
    .optional()
    .isEmail().withMessage("صيغة البريد الإلكتروني غير صحيحة")
    .custom(async (email, { req }) => {
      const existing = await Admin.findOne({ email });
      if (existing && existing._id.toString() !== req.params.id) {
        throw new Error("البريد الإلكتروني مستخدم بالفعل");
      }
      return true;
    }),

  body("password")
    .optional()
    .isLength({ min: 8 }).withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .matches(/[A-Z]/).withMessage("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .matches(/[a-z]/).withMessage("كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .matches(/[0-9]/).withMessage("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
    .matches(/[^A-Za-z0-9]/).withMessage("كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"),

  body("passwordConfirm")
    .optional()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("كلمتا المرور غير متطابقتين");
      }
      return true;
    }),
];

const validateAdminUpdate = async (req, res, next) => {
  await Promise.all(updateAdminValidationRules.map((rule) => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateAdmin,
  validateAdminUpdate,
};
