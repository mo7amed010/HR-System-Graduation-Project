const Joi = require("joi");

const attendanceValidation = Joi.object({
  employeeId: Joi.string().required().messages({
    "string.base": "employeeId must be a string",
    "any.required": "employeeId is required",
  }),
  date: Joi.date().required().messages({
    "date.base": "date must be a valid date",
    "any.required": "date is required",
  }),
  checkIn: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "checkIn must be in HH:mm format",
      "any.required": "checkIn is required",
    }),
  checkOut: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "checkOut must be in HH:mm format",
      "any.required": "checkOut is required",
    }),
});

module.exports = attendanceValidation;
