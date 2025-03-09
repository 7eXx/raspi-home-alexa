import pino from 'pino';
import environment from './environment';

const logger = pino({
    level: environment.LOG_LEVEL,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

export default logger;