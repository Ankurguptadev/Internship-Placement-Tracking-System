const Joi = require("joi");

exports.createAnnouncementSchema = Joi.object({
  title: Joi.string().required(),
  message: Joi.string().required(),
  drive_id: Joi.number().optional(),
});
