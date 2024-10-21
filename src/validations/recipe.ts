import Joi from 'joi';
import { validationGenerator } from './generator';

const querySchema = Joi.object({
  page: Joi.number().optional().default(1),
  limit: Joi.number().optional().default(10),
  search: Joi.string().optional(),
  userId: Joi.number().optional(),
  foodNames: Joi.array().items(Joi.string()).optional(),
});

const createSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  htmlContent: Joi.string().optional(),
  foodIds: Joi.array().items(Joi.number()).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  htmlContent: Joi.string().optional(),
  foodIds: Joi.array().items(Joi.number()).optional(),
});

export const recipeValidation = {
  create: validationGenerator(createSchema),
  query: validationGenerator(querySchema, 'query'),
  update: validationGenerator(updateSchema),
};
