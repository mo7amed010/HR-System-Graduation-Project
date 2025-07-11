const Joi = require("joi");

const generalSettingSchema = Joi.object({
  method: Joi.string().valid("money", "hours").required(),
  add: Joi.number().required(),
  deduct: Joi.number().required(),
  offDay1: Joi.string()
    .valid("السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة").required(),
 offDay2: Joi.string()
  .valid("السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة","") .invalid(Joi.ref("offDay1"))
});
module.exports = generalSettingSchema;
