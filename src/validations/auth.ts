import Joi from 'joi';
import { validationGenerator } from './generator';

const authCondition = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshTokenCondition = Joi.object({
  refreshToken: Joi.string().required(),
});

export const authValidation = {
  auth: validationGenerator(authCondition),
  refreshToken: validationGenerator(refreshTokenCondition),
};
