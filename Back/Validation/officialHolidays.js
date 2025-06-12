const joi = require("joi");

const officialHolidaysSchema = joi.object({
  name: joi.string().required(),
  date: joi.string().required(),
});

module.exports = officialHolidaysSchema;
