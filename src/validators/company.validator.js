const Joi = require("joi");

exports.updateCompanySchema = Joi.object({
  name: Joi.string().max(120),
  domain: Joi.string().max(120),
});
