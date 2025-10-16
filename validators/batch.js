import Joi from "joi";

export const createBatchValidator = Joi.object({
  farmer: Joi.string().required(),
  crop: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  collectionLocation: Joi.string().required(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  gpsAddress: Joi.string().optional(),
  batchCode: Joi.string().optional(),
});

export const updateBatchValidator = Joi.object({
  farmer: Joi.string().optional(),
  crop: Joi.string().optional(),
  quantity: Joi.number().min(1).optional(),
  collectionLocation: Joi.string().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  gpsAddress: Joi.string().optional(),
  batchCode: Joi.string().optional(),
});