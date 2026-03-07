const Joi = require("joi");

exports.createDriveSchema = Joi.object({
  title: Joi.string().max(200).required(),
  min_cgpa: Joi.number().min(0).max(10).required(),
  deadline: Joi.date().greater("now").required(),
  status: Joi.string().valid("DRAFT", "OPEN", "CLOSED", "COMPLETED").required(),
});

exports.updateDriveSchema = Joi.object({
  title: Joi.string().max(200).optional(),
  min_cgpa: Joi.number().min(0).max(10).optional(),
  deadline: Joi.date().optional(),
  status: Joi.string().valid("DRAFT", "OPEN", "CLOSED", "COMPLETED").optional(),
});
