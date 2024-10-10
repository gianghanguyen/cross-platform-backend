import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/api-error';
import httpStatus from 'http-status';

const tokenExtractor = (role: 'USER' | 'ADMIN' = 'USER') => {
  return (req: Request, res: Response, next: NextFunction) => {
    let jwtSecret = process.env.JWT_ACCESS_TOKEN_SECRET || '';
    if (role === 'ADMIN') {
      jwtSecret = process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN || '';
    }

    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        req.user = jwt.verify(authorization.substring(7), jwtSecret) as {
          id: number;
          email: string;
        };
      } catch {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
      }
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Token is missing');
    }
    next();
  };
};

export { tokenExtractor };
