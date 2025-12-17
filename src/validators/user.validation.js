const Joi = require("joi");

// REGISTER VALIDATION
const registerValidator = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// LOGIN VALIDATION
const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerValidator,
  loginValidator,
};