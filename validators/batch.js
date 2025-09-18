import Joi from "joi";

export const createBatchValidator = Joi.object({
  farmer: Joi.string().required(),
  cropType: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  // gpsAddress: Joi.string().required(),
  collectionLocation: Joi.string().required(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});

export const updateBatchValidator = Joi.object({
  farmer: Joi.string().optional(),
  cropType: Joi.string().optional(),
  quantity: Joi.number().min(1).optional(),
  gpsAddress: Joi.string().optional(),
  collectionLocation: Joi.string().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});