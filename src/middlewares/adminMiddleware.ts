import { NextFunction, Request, Response } from 'express';

import { getApiKey } from '../utils/decode.util';
import logger from '../logger/logger';

export default async function adminAuthMiddle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const apiKey = getApiKey(req.headers);
    if (apiKey == process.env.API_KEY) {
      req.body.isAdmin = true;
      next();
      return;
    }
    throw new Error('Invalid API key');
  } catch (error: any) {
    logger.error(`adminAuthMiddleware, error: ${error.message}`);

    res.status(401).json({
      success: false,
      auth: false,
      msg: 'Token expired or invalid or API Key was invalid',
    });
  }
}
