/*
When performing multiple related database operations, 
use transactions to maintain data integrity. 
Handle transaction errors gracefully.
*/
// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entities/User';
import { ValidationError, DatabaseError } from '../errors/CustomError';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getManager().transaction(async transactionalEntityManager => {
            const user = transactionalEntityManager.create(User, req.body);
            await transactionalEntityManager.save(user);
        });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            next(new ValidationError('Email already exists'));
        } else {
            next(new DatabaseError('Failed to create user'));
        }
    }
};
