import Joi from 'joi';
import { validationGenerator } from './generator';

const querySchema = Joi.object({
  day: Joi.date().required(),
});

const createSchema = Joi.object({
  name: Joi.string().required(),
  timestamp: Joi.date().required(),
  status: Joi.string().valid('NOT_PASS_YET', 'DONE').optional(),
  foodIds: Joi.array().items(Joi.number()).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  timestamp: Joi.date().optional(),
  status: Joi.string().valid('NOT_PASS_YET', 'DONE').optional(),
  foodIds: Joi.array().items(Joi.number()).optional(),
});

export const mealPlanValidation = {
  create: validationGenerator(createSchema),
  query: validationGenerator(querySchema, 'query'),
  update: validationGenerator(updateSchema),
};
