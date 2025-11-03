import Joi from "joi";

export const registerUserValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().valid(),
    password: Joi.string().required(),
    contact: Joi.string(),
    role: Joi.string().valid('user', 'admin')
});

export const loginUserValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const updateUserValidator =Joi.object({
    name: Joi.string(),
    avatar: Joi.string(),
    password: Joi.string(),
    contact: Joi.string(),
});

export  const forgotPasswordValidator = Joi.object({
    email: Joi.string().email().required(),
});
export const resetPasswordValidator = Joi.object({
    password: Joi.string().required(),
});