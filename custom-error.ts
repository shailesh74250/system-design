// Custom Error Classes
/*
Define custom error classes to encapsulate different error types, making it easier to handle them appropriately.
*/

// src/errors/CustomError.ts
export class CustomError extends Error {
    public readonly status: number;
    public readonly isOperational: boolean;

    constructor(message: string, status: number, isOperational: boolean = true) {
        super(message);
        this.status = status;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

// Specific Errors
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
        super(message, 500);
    }
}


// src/routes/userRoutes.ts
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { NotFoundError, DatabaseError } from '../errors/CustomError';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOneOrFail(req.params.id);
        res.json(user);
    } catch (error) {
        if (error.name === 'EntityNotFound') {
            next(new NotFoundError('User not found'));
        } else {
            next(new DatabaseError('Failed to retrieve user'));
        }
    }
};
