import Joi from "joi";

export const registerFarmerValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string(),
    email: Joi.string().email(),
    idNumber: Joi.string(),
    address: Joi.string().required(),
    gpsAddress: Joi.string(),
    farmSize: Joi.string().required(),
    cropType: Joi.string().required(),
    image: Joi.string(),
});

export const updateFarmerValidator = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email(),
    idNumber: Joi.string(),
    address: Joi.string(),
    gpsAddress: Joi.string(),
    farmSize: Joi.string(),
    cropType: Joi.string(),
    image: Joi.string(),
});