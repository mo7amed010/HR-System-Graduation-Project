const joi = require("joi");

const userSchema = joi.object({
  name: joi.string().required().min(3).max(15),
  username: joi.string().required().min(4).max(15),
  password: joi.string().required(),
  email: joi.string().email().required().min(8),
});

module.exports = userSchema;
