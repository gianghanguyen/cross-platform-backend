import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ApiError from '~/utils/api-error';
import httpStatus from 'http-status-codes';

export function validationGenerator(correctCondition: Joi.ObjectSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await correctCondition.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, new Error(error as any).message));
    }
  };
}
