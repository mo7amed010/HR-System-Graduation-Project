const Joi = require("joi");

const officialHolidaysSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "اسم الإجازة مطلوب",
    "string.empty": "اسم الإجازة لا يمكن أن يكون فارغًا",
  }),

  date: Joi.date().required().messages({
    "any.required": "تاريخ الإجازة مطلوب",
    "date.base": "صيغة التاريخ غير صحيحة",
  }),

  type: Joi.string()
    .valid("عطلة دينية", "عطلة وطنية", "عطلة رسمية")
    .required()
    .messages({
      "any.required": "نوع الإجازة مطلوب",
      "any.only": "نوع الإجازة يجب أن يكون إما: عطلة دينية، عطلة وطنية، أو عطلة رسمية",
    }),

  duration: Joi.number()
    .min(1)
    .required()
    .messages({
      "any.required": "مدة الإجازة مطلوبة",
      "number.base": "المدة يجب أن تكون رقمًا",
      "number.min": "يجب أن تكون مدة الإجازة على الأقل يوم واحد",
    }),

  description: Joi.string().allow("").optional(),

  repeated: Joi.boolean().optional(),
});

module.exports = officialHolidaysSchema;
