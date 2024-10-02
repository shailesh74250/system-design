// src/errors/CustomError.ts

export class CustomError extends Error {
  public readonly status: number;
  public readonly isOperational: boolean;

  constructor(message: string, status: number, isOperational: boolean = true) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string = 'Database error') {
    super(message, 404);
  }
}