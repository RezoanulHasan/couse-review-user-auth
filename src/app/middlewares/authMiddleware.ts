/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

interface JwtPayload {
  _id: string;
  role: string;
  email: string;
  iat: number;
  exp: number;
}

const createErrorResponse = (
  res: Response,
  status: number,
  message: string,
  errorMessage: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorDetails: any = null,
) => {
  return res.status(status).json({
    success: false,
    message,
    errorMessage,
    errorDetails,
    stack: null,
  });
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('Authorization');

  if (!token) {
    return createErrorResponse(
      res,
      401,
      'Unauthorized Access',
      'You do not have the necessary permissions to access this resource',
    );
  }

  jwt.verify(token, config.SECRET_KEY as string, (err, decodedToken) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return createErrorResponse(
          res,
          401,
          'Unauthorized Access',
          'Token has expired.',
        );
      } else {
        return createErrorResponse(
          res,
          401,
          'Unauthorized Access',
          'Invalid or malformed token.',
        );
      }
    }

    const user = decodedToken as JwtPayload;

    req.body.userId = user._id;
    req.body.user = user;
    next();
  });
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const userRole = req.body.user?.role;

  if (userRole === 'admin') {
    next();
  } else {
    createErrorResponse(
      res,
      403,
      'Unauthorized Access',
      'Admin rights required.',
    );
  }
};

export const isUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const userRole = req.body.user?.role;

  if (userRole && userRole !== 'admin') {
    next();
  } else {
    createErrorResponse(
      res,
      403,
      'Unauthorized Access',
      'Regular user rights required.',
    );
  }
};
