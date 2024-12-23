import Joi from 'joi';
import { validationGenerator } from './generator';

const createSchema = Joi.object({
  name: Joi.string().required(),
});

const addMembersSchema = Joi.object({
  emails: Joi.array().items().required(),
});

const removeMembersSchema = Joi.object({
  userIds: Joi.array().items(Joi.number()).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  image: Joi.object().optional(),
});

export const groupValidation = {
  create: validationGenerator(createSchema),
  addMembersSchema: validationGenerator(addMembersSchema),
  removeMembersSchema: validationGenerator(removeMembersSchema),
  update: validationGenerator(updateSchema),
};
