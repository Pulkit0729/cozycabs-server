import { NextFunction, Request, Response } from "express";

import { verifyJWT } from "../utils/jwtUtils";
import { getBearerToken } from "../utils/decodeUtils";
import { getUser } from "../dal/user.dal";
import logger from "../logger/logger";

export default async function authMiddle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const jwt = getBearerToken(req.headers);
  if (jwt === undefined || jwt === null) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    const token: any = verifyJWT(jwt);
    const user = await getUser(token.sub);
    if (!user || !user.phoneConfirmed) {
      throw new Error("Unauthorized");
    }
    req.body = { ...req.body, auth: true, user: user };
    next();
  } catch (error: any) {
    logger.error(`authMiddleware, error: ${error.message}`);
    res.status(401).json({
      success: false,
      auth: false,
      msg: "Token expired or invalid",
    });
  }
}
