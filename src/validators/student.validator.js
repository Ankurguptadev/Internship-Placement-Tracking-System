const Joi = require("joi");

exports.updateStudentSchema = Joi.object({
  batch: Joi.string().max(10).optional(),
  branch: Joi.string().max(50).optional(),
  cgpa: Joi.number().min(0).max(10).optional(),
});
