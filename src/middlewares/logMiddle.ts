import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';
import auditLogger from '../logger/auditLogger';

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
    if (
      req.originalUrl.startsWith('/v1/authdriver/') ||
      req.originalUrl.startsWith('/v1/auth/') ||
      req.originalUrl.startsWith('/v1/booking/') ||
      req.originalUrl.startsWith('/v1/driver/') ||
      req.originalUrl.startsWith('/v1/referral/') ||
      req.originalUrl.startsWith('/v1/ride/') ||
      req.originalUrl.startsWith('/v1/user/') ||
      req.originalUrl.startsWith('/v1/userpromo/')
    ) {
      auditLogger.info(
        `Event ${logDetails.additionalInfo.request.url}`,
        logDetails
      );
    } else {
      logger.info(`API ${logDetails.additionalInfo.request.url}`, logDetails);
    }
  });
  next();
};

export default logMiddleware;
