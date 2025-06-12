const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const employeeSchema = Joi.object({
  name: Joi.string().required().min(10).max(35),
  address: Joi.string().required().min(10),
  phone: Joi.string().required().length(11),
  gender: Joi.string().required().valid("male", "female"),
  nationality: Joi.string().required().min(3),
  dob: Joi.date().required(),
  ssn: Joi.string().length(14).required(),
  hiredDate: Joi.date().required(),
  department: Joi.objectId().required(),
  salary: Joi.number().required(),
  checkIn: Joi.date().required(),
  checkOut: Joi.date().required(),
});

module.exports = employeeSchema;
