import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';

const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    const logDetails = {
      additionalInfo: {
        request: {
          ip:
            req.headers['x-real-ip'] ||
            req.headers['x-forwared-for'] ||
            req.socket.remoteAddress ||
            '',
          method: req.method,
          body: req.body,
          url: req.originalUrl,
        },
        response: {
          statusCode: res.statusCode,
        },
      },
      timestamp: new Date().toISOString(),
    };
    logger.info('API', logDetails);
  });
  next();
};

export default logMiddleware;
