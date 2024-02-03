/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { Request, Response, NextFunction } from 'express';
import config from '../config';
const globalErrorHandler = (
  // eslint-disable-next-line no-undef
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  console.error(err.stack);

  //....................For  ValidationError.................

  if (err.name === 'ValidationError') {
    const validationError = err as any; // Type cast to any to access ZodError properties

    const issues = validationError.issues.map((issue: any) => ({
      expected: issue.expected,
      received: issue.received,
      code: issue.code,
      path: issue.path,
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errorMessage: err.message,
      errorDetails: {
        issues,
        name: 'ZodError',
      },
      stack: config.NODE_ENV === 'development' ? err.stack : null,
    });
  }
  //...................... for CastError....................
  if (err.name === 'CastError') {
    const castError = err as any; // Type cast to any to access CastError properties

    return res.status(400).json({
      success: false,
      message: 'Invalid ID',
      errorMessage: `${castError.value} is not a valid ID!`,
      errorDetails: {
        stringValue: castError.stringValue,
        valueType: castError.valueType,
        kind: castError.kind,
        value: castError.value,
        path: castError.path,
        reason: castError.reason,
        name: 'CastError',
        message: castError.message,
      },
      stack: config.NODE_ENV === 'development' ? err.stack : null,
    });
  }
  //.................. For Duplicate Entry (MongoDB E11000 Error).................
  if (
    err.name === 'MongoError' &&
    (err as any).code === 11000 &&
    (err as any).keyPattern &&
    (err as any).keyValue
  ) {
    // Assuming this is a MongoDB duplicate key error
    return res.status(400).json({
      success: false,
      message: 'Duplicate Entry',
      errorMessage: 'Duplicate entry found. This record already exists.',
      errorDetails: {
        keyPattern: (err as any).keyPattern,
        keyValue: (err as any).keyValue,
        name: 'MongoError',
        code: (err as any).code,
        message: err.message,
      },
      stack: config.NODE_ENV === 'development' ? err.stack : null,
    });
  }

  //................... for Internal Server Error..................

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    errorMessage: err.message,
    errorDetails: {
      name: err.name,
      message: err.message,
    },
    stack: config.NODE_ENV === 'development' ? err.stack : null,
  });
};

export default globalErrorHandler;
