const Joi = require("joi");

// Approved password policy: 8–64 chars, upper/lower/number/special.
const password = Joi.string()
  .min(8)
  .max(64)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must include an uppercase letter, a lowercase letter, a number, and a special character.",
  });

const email = Joi.string().trim().lowercase().email().required();

const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(1).max(100).required(),
  email,
  password,
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

const googleSchema = Joi.object({
  idToken: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email,
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: password,
});

module.exports = {
  registerSchema,
  loginSchema,
  googleSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
