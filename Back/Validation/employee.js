const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const employeeSchema = Joi.object({
  name: Joi.string().required().min(10).max(35).messages({
    "any.required": "الاسم مطلوب",
    "string.empty": "الاسم مطلوب",
    "string.min": "يجب ألا يقل الاسم عن 10 أحرف",
    "string.max": "يجب ألا يزيد الاسم عن 35 حرفًا"
  }),

  address: Joi.string().required().min(10).messages({
    "any.required": "العنوان مطلوب",
    "string.empty": "العنوان مطلوب",
    "string.min": "يجب ألا يقل العنوان عن 10 أحرف"
  }),

  phone: Joi.string().regex(/^[0-9]{11}$/).required().messages({
    "string.pattern.base": "رقم الهاتف يجب أن يتكون من 11 رقمًا",
    "string.empty": "رقم الهاتف مطلوب",
    "any.required": "رقم الهاتف مطلوب"
  }),

  gender: Joi.string().required().valid("male", "female").messages({
    "any.required": "النوع مطلوب",
    "any.only": "النوع يجب أن يكون male أو female"
  }),

  nationality: Joi.string().required().min(3).messages({
    "any.required": "الجنسية مطلوبة",
    "string.empty": "الجنسية مطلوبة",
    "string.min": "يجب ألا تقل الجنسية عن 3 أحرف"
  }),

  dob: Joi.date().min('1920-01-01').max('2005-01-01').required().messages({
    "date.base": "صيغة تاريخ الميلاد غير صحيحة",
    "date.min": "تاريخ الميلاد لا يمكن أن يكون قبل 01-01-1920",
    "date.max": "تاريخ الميلاد لا يمكن أن يكون بعد 01-01-2005",
    "any.required": "تاريخ الميلاد مطلوب"
  }),

  ssn: Joi.string().length(14).required().messages({
    "string.length": "الرقم القومي يجب أن يتكون من 14 رقمًا",
    "string.empty": "الرقم القومي مطلوب",
    "any.required": "الرقم القومي مطلوب"
  }),

  hiredDate: Joi.date().min('2008-01-02').required().messages({
    "date.base": "صيغة تاريخ التعيين غير صحيحة",
    "date.min": "تاريخ التعيين يجب أن يكون بعد 01-01-2008",
    "any.required": "تاريخ التعيين مطلوب"
  }),

  department: Joi.objectId().required().messages({
    "any.required": "القسم مطلوب",
    "string.empty": "القسم مطلوب"
  }),

  salary: Joi.number().min(0).required().messages({
    "number.base": "من فضلك أدخل الراتب بشكل صحيح ",
    "number.min": "الراتب لا يمكن أن يكون أقل من 0",
    "any.required": "الراتب مطلوب"
  }),

  jobTitle: Joi.string().required().messages({
    "any.required": "المسمى الوظيفي مطلوب",
    "string.empty": "المسمى الوظيفي مطلوب"
  }),

  checkIn: Joi.string().required().messages({
    "any.required": "وقت الحضور مطلوب",
    "string.empty": "وقت الحضور مطلوب"
  }),

  checkOut: Joi.string().required().messages({
    "any.required": "وقت الانصراف مطلوب",
    "string.empty": "وقت الانصراف مطلوب"
  }),
});

module.exports = employeeSchema;
