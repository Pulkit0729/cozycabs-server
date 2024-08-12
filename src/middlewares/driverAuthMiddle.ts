import { NextFunction, Request, Response } from 'express';

import { verifyJWT } from '../utils/jwt.util';
import { getBearerToken } from '../utils/decode.util';
import logger from '../logger/logger';
import { getDriver } from '../dal/driver.dal';

export default async function driverAuthMiddle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const jwt = getBearerToken(req.headers);
  if (jwt === undefined || jwt === null) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
  try {
    const token: any = verifyJWT(jwt);
    const driver = await getDriver(token.sub);
    if (!driver || !driver.phoneConfirmed) {
      throw new Error('Unauthorized');
    }
    req.body = { ...req.body, auth: true, user: driver };
    next();
  } catch (error: any) {
    logger.error(`authMiddleware, error: ${error.message}`);
    res.status(401).json({
      success: false,
      auth: false,
      msg: 'Token expired or invalid',
    });
  }
}
