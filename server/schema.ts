import Joi from 'joi';
// These validate the input being passed in
export const signupSchema = Joi.object().keys({
    username: Joi.string().trim().regex(/(^[a-zA-Z0-9_-]*$)/).min(2).max(30).required(),
    password: Joi.string().trim().regex(/(^[a-zA-Z0-9_!@#$%^&*()-="',.<>/?:`~]*$)/).min(2).max(30).required(),
    email: Joi.string().trim().email().required(),
    ha_username: Joi.string().trim().regex(/(^[a-zA-Z0-9_!@#$%^&*()-="',.<>/?:`~]*$)/).min(2).max(30).required(),
    ha_password: Joi.string().trim().regex(/(^[a-zA-Z0-9_!@#$%^&*()-="',.<>/?:`~]*$)/).min(2).max(30).required()
});

export const loginSchema = Joi.object().keys({
    username: Joi.string().trim().regex(/(^[a-zA-Z0-9_-]*$)/).min(2).max(30).required(),
    password: Joi.string().trim().regex(/(^[a-zA-Z0-9_!@#$%^&*()-="',.<>/?:`~]*$)/).min(2).max(30).required()
});