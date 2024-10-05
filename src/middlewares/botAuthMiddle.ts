import { NextFunction, Request, Response } from 'express';

import { verifyJWT } from '../utils/jwt.util';
import { getApiKey, getBearerToken } from '../utils/decode.util';
import { getUser } from '../dal/user.dal';
import logger from '../logger/logger';
import { BlockUserService } from '../services/blockUser.service';

export default async function botAuthMiddle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const botAccessToken = getBearerToken(req.headers);
    if (botAccessToken === undefined || botAccessToken === null) {
      throw new Error('Access token not available');
    }
    const token: any = verifyJWT(botAccessToken);
    const user = await getUser(token.sub);
    if (!user) {
      throw new Error('Unauthorized');
    }
    await BlockUserService.validatedBlockUser(user);
    req.body = { ...req.body, auth: true, user: user, fromBot: true };
    next();
    return;
  } catch (error: any) {
    logger.error(`bot Middleware, error: ${error.message}`);
  }

  try {
    const apiKey = getApiKey(req.headers);
    if (apiKey == process.env.API_KEY) {
      req.body.isAdmin = true;
      next();
      return;
    }
    throw new Error('Invalid API key');
  } catch (error: any) {
    logger.error(`botAuthMiddleware, error: ${error.message}`);

    res.status(401).json({
      success: false,
      data: {
        auth: false,
        msg: 'Token expired or invalid or API Key was invalid',
      },
    });
  }
}
