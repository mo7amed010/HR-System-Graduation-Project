const joi = require("joi");

const weeklyHolidaysSchema = joi.object({
  offDay1: joi.string().required(),
  offDay2: joi.string().required(),
});

module.exports = weeklyHolidaysSchema;
