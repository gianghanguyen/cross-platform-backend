import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/api-error';
import { Prisma } from '@prisma/client';

const errorConverter = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let message = error.message || httpStatus[500];

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      statusCode = httpStatus.BAD_REQUEST;
      if (error.code === 'P2025') {
        message = 'Resource not found.';
      }
      if (error.code === 'P2003') {
        message = 'Foreign key constraint violated.';
      }
      if (error.code === 'P2002') {
        message = 'Unique constraint violation.';
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      statusCode = httpStatus.BAD_REQUEST;
      message = 'Validation error: Invalid request data.';
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = 'Prisma initialization error.';
    }
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = err;
  const response = {
    code: statusCode,
    message,
  };
  res.status(statusCode).send({ response, stack: err.stack });
};

export { errorConverter, errorHandler };
