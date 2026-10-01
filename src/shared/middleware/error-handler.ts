import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';
import type { ErrorRequestHandler } from 'express';

import { AppError } from '../errors/app-error.js';
import { logger } from '../../infrastructure/logger/logger.js';

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  const parseError = error as Error & {
    type?: string;
    status?: number;
    statusCode?: number;
    body?: unknown;
  };

  if (error instanceof ZodError) {
    response.status(400).json({
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      issues: error.flatten(),
    });
    return;
  }

  if (parseError.type === 'entity.parse.failed') {
    response.status(400).json({
      message: 'Invalid JSON payload',
      code: 'INVALID_JSON',
    });
    return;
  }

  if (error instanceof PrismaClientInitializationError) {
    response.status(503).json({
      message: 'Database unavailable',
      code: 'DATABASE_UNAVAILABLE',
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
    return;
  }

  logger.error({ error }, 'Unhandled application error');
  response.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
};
