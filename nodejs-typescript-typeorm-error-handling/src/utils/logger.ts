// Logging with Winston
// src/utils/logger.ts

import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors } = format;

const myFormat = printf(({level, message, timestamp, stack}) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        errors({stack: true}), // Capture stack trace
        myFormat
    ),
    transports: [
        new transports.File({filename: 'logs/error.log', level: 'error'}),
        new transports.File({filename: 'logs/combined.log'}),
    ]
});

if(process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(
            format.colorize(),
            myFormat
        )
    }))
}

export default logger;