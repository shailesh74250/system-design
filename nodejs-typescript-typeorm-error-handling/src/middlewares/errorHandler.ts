// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { CustomError } from '../errors/CustomError';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    logger.error(`${req.method} ${req.url} - ${err.message}`, {stack: err.stack });

    if(err instanceof CustomError) {
        res.status(err.status).json({message: err.message});
    } else {
        res.status(500).json({ message: 'Internal Server Error'});
    }
}

export default errorHandler;