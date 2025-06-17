const Joi = require("joi");

exports.create = Joi.object({ 
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({ 
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
      "string.min": "Name should be at least 2 letters",
      "string.max": "Name should not be more than 50 letters",
      "any.required": "Name is required"
    })
});
