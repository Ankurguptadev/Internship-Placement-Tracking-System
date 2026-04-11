const Joi = require("joi");

exports.createOfferSchema = Joi.object({
  student_id: Joi.number().required(),
  drive_id: Joi.number().required(),
  package: Joi.number().min(0).required(),
});

exports.updateOfferSchema = Joi.object({
  status: Joi.string().valid("ACCEPTED", "REJECTED").required(),
});
