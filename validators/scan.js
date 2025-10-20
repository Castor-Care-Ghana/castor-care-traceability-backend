import Joi from "joi";

export const createScanValidator = Joi.object({
  package: Joi.string().required(),
  scannedBy: Joi.string().optional(),
  location: Joi.string().optional().allow(""),
  status: Joi.string().valid("available", "sold", "in-transit").optional(),
  updateFirst: Joi.boolean().optional(),
});

export const updateScanValidator = Joi.object({
  scannedBy: Joi.string().optional(),
  location: Joi.string().optional(),
  status: Joi.string().valid("available", "sold", "in-transit").optional(),
});
