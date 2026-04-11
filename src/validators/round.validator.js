const Joi = require("joi");

exports.createRoundSchema = Joi.object({
  name: Joi.string().max(50).required(),
  seq_no: Joi.number().min(1).required(),
});

exports.roundResultSchema = Joi.object({
  student_id: Joi.number().required(),
  status: Joi.string().valid("PASS", "FAIL").required(),
});
