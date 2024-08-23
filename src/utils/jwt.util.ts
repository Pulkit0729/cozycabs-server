import { CookieOptions } from 'express';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const pathToPrivateKey = path.join(__dirname, '..', 'keys', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, 'utf8');

const pathToPublicKey = path.join(__dirname, '..', 'keys', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToPublicKey, 'utf8');

/**
 *
 * @param userId
 * @returns a base 64 encoded jwt token
 */
export function issueJWT(userId: string) {
  const _id = userId;
  const payload = {
    sub: _id,
    iat: Date.now(),
    expiresIn: '10h',
    // exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
  };
  const jwtToken = jwt.sign(payload, PRIV_KEY, {
    algorithm: 'RS256',
    allowInsecureKeySizes: true,
  });
  return Buffer.from(jwtToken).toString('base64');
}

/**
 *
 * @param token base64 jwt token
 * @returns
 */
export function verifyJWT(token: string) {
  return jwt.verify(Buffer.from(token, 'base64').toString('ascii'), PUB_KEY, {
    algorithm: 'RS256',
  } as VerifyOptions);
}
export const jwtOptions: CookieOptions = {
  sameSite: 'none',
  domain: process.env.DOMAIN,
  secure: true,
  maxAge: 1000000 * 60 * 15, // would expire after 15 minutes
  httpOnly: true, // The cookie only accessible by the web server
  // Indicates if the cookie should be signed
};
