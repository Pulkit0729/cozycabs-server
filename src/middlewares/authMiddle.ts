import { NextFunction, Request, Response } from 'express';

import { verifyJWT } from '../utils/jwt.util';
import { getBearerToken } from '../utils/decode.util';
import { getUser } from '../dal/user.dal';
import logger from '../logger/logger';
import BlockedUser from '../models/blockedUser';
import { IUser } from '../models/users';
import { Document } from 'mongoose';

export default async function authMiddle(
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
    const user = await getUser(token.sub);
    if (!user || !user.phoneConfirmed) {
      throw new Error('Unauthorized');
    }
    await validatedBlockUser(user);
    req.body = { ...req.body, auth: true, user: user };
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

async function validatedBlockUser(
  user: Document<unknown, {}, IUser> &
    IUser &
    Required<{
      _id: unknown;
    }>
) {
  const blockedUser = await BlockedUser.findOne({ userId: user.userId });
  if (blockedUser && blockedUser.isBlocked) {
    throw new Error('User blocked');
  }
}
