import Joi from 'joi';
import { validationGenerator } from './generator';

const querySchema = Joi.object({
  page: Joi.number().optional().default(1),
  limit: Joi.number().optional().default(10),
});

const createSchema = Joi.object({
  quantity: Joi.number().required(),
  foodId: Joi.number().required(),
  note: Joi.string().optional(),
  startDate: Joi.date().required(),
  expiredDate: Joi.date().required(),
});

const updateSchema = Joi.object({
  quantity: Joi.number().optional(),
  foodId: Joi.number().optional(),
  note: Joi.string().optional(),
  startDate: Joi.date().optional(),
  expiredDate: Joi.date().optional(),
});

export const fridgeItemValidation = {
  query: validationGenerator(querySchema, 'query'),
  create: validationGenerator(createSchema),
  update: validationGenerator(updateSchema),
};
