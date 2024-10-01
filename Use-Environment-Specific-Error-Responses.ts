// Provide detailed error messages in development while keeping responses generic in production.

// src/middlewares/errorHandler.ts
function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    logger.error(err);

    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production' && !err.isOperational
        ? 'Internal Server Error'
        : err.message;

    res.status(status).json({ message });
}
