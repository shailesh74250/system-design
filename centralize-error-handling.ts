// Centralized Error Handling Middleware

// Having a centralized location to handle errors ensures consistency and reduces redundancy.

import { Request, Response, NextFunction } from 'express';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err); // Log the error

    if (err instanceof CustomError) {
        res.status(err.status).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default errorHandler;


Usages:
import express from 'express';
import errorHandler from './middlewares/errorHandler';

const app = express();

// ... your routes

app.use(errorHandler); // Place after all routes


// autoSense error middleware example 
import { NextFunction, Request, Response } from 'express';
import { log, log_levels } from './logger/logger';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { AxiosError } from 'axios';

export class ValidationError extends Error {
  constructor(message: string, public statusCode: number = StatusCodes.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
  }
}

// TypeScript Enhancements
// Type Safety: TypeScript allows defining custom error types and ensuring that errors adhere to specific interfaces, enhancing the robustness of error handling.
export class HttpError extends Error {
  private readonly status: number;
  private readonly error_code: string;
  private readonly details: any;
  constructor(status: number, error_code: string, message: string) {
    super(message);
    this.status = status;
    this.error_code = error_code;
    this.message = message;
    Error.captureStackTrace(this, HttpError);
  }
  public getErrorCode(): string {
    return this.error_code;
  }

  public getStatus(): number {
    return this.status;
  }

  public getMessage(): string {
    return this.message;
  }

  public getDetails(): any {
    return this.details;
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT, message);
  }
}

export class InternalSeverError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, message);
  }
}

export class UnProcessableError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.UNPROCESSABLE_ENTITY, ReasonPhrases.UNPROCESSABLE_ENTITY, message);
  }
}

export class TooManyRequestError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.TOO_MANY_REQUESTS, ReasonPhrases.TOO_MANY_REQUESTS, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, message);
  }
}

export const handleError = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  log(log_levels.error, 'error', err);
  let status_code = 500;
  let message = 'Internal server error';
  let error_code;

  if (err instanceof ValidationError) {
    status_code = err.statusCode;
    message = err.message;
  } else if (err instanceof AxiosError) {
    if (err.response) {
      status_code = err.response.status;
      message = err.response.data.message || 'Error from external service';
      error_code = err.response.data.code;
    } else if (err.request) {
      message = 'No response from external service';
    } else {
      message = err.message;
    }
  } else if (err instanceof HttpError) {
    status_code = err.getStatus();
    message = err.getMessage();
    error_code = err.getErrorCode();
  }

  const response: Record<string, string | null | undefined> = {
    message: message,
  };

  if (error_code) {
    response.code = error_code;
  }

  res.status(status_code).json(response);
};


// Usages 
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(winstonLogger);
app.use(correlator());

app.use('/api', router);
app.use('/health-check', healthCheck);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger_document));
app.use(handleError);  // Place after all routes
