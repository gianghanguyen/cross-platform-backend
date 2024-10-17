import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ApiError from '~/utils/api-error';
import httpStatus from 'http-status-codes';

type ValidationTarget = 'body' | 'query' | 'params';

export function validationGenerator(correctCondition: Joi.ObjectSchema, target: ValidationTarget = 'body') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[target];
      await correctCondition.validateAsync(dataToValidate, { abortEarly: false });
      next();
    } catch (error) {
      next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, new Error(error as any).message));
    }
  };
}
