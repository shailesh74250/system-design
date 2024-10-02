// src/middlewares/validate.ts
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError as CustomValidationError } from '../errors/CustomError';

export function validationMiddleware<T>(type: any): (req: Request, res: Response, next: NextFunction) => void {
    return (req, res, next) => {
        const dto = plainToClass(type, req.body);
        validate(dto).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                const messages = errors.map(error => Object.values(error.constraints || {})).flat();
                next(new CustomValidationError(messages.join(', ')));
            } else {
                next();
            }
        });
    };
}
