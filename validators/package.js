import Joi from "joi";

// Create validation
export const createPackageValidator = Joi.object({
  batch: Joi.string().required(),
  weight: Joi.number().min(1).required(),
});

// Update validation
export const updatePackageValidator = Joi.object({
  weight: Joi.number().min(1),
});
