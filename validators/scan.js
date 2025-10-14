import Joi from "joi";

export const createScanValidator = Joi.object({
  package: Joi.string().required(),
  scannedBy: Joi.string().valid("consumer", "distributor", "retailer", "castor staff").required(),
  location: Joi.string().optional(),
  deviceInfo: Joi.string().optional(),
  user: Joi.string().optional(),
});

export const updateScanValidator = Joi.object({
  package: Joi.string().optional(),
  scannedBy: Joi.string().valid("consumer", "distributor", "retailer", "castor staff").optional(),
  location: Joi.string().optional(),
  deviceInfo: Joi.string().optional(),
  user: Joi.string().optional(),
});
