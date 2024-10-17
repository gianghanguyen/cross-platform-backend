import Joi from 'joi';
import { validationGenerator } from './generator';

const createSchema = Joi.object({
  name: Joi.string().required(),
  photoUrl: Joi.string().optional().uri(),
});

const manageSchema = Joi.object({
  userIds: Joi.array().items(Joi.number()).required(),
  action: Joi.string().valid('ADD', 'REMOVE').required(),
});

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  photoUrl: Joi.string().optional().uri(),
});

export const groupValidation = {
  create: validationGenerator(createSchema),
  manageMember: validationGenerator(manageSchema),
  update: validationGenerator(updateSchema),
};
