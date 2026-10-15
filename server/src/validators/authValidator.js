import Joi from 'joi';
import { errorResponse } from '../utils/apiResponse.js';

// ── Validator factory ─────────────────────────────────────────────────────────
const validate = (schema, target = 'body') =>
  (req, res, next) => {
    const { error } = schema.validate(req[target], { abortEarly: false, stripUnknown: true });
    if (error) {
      const errors = error.details.map((d) => d.message.replace(/"/g, ''));
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    next();
  };

// ── Schemas ───────────────────────────────────────────────────────────────────
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, and a number',
    }),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional().messages({
    'string.pattern.base': 'Please provide a valid Indian phone number',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required(),
});

// ── Validators ────────────────────────────────────────────────────────────────
export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateForgotPassword = validate(forgotPasswordSchema);
export const validateResetPassword = validate(resetPasswordSchema);
export const validateChangePassword = validate(changePasswordSchema);
