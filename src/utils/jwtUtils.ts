import { CookieOptions } from 'express';
import jwt, { VerifyOptions } from "jsonwebtoken";
import fs from "fs";
import path from "path";

const pathToPrivateKey = path.join(__dirname, "..", "keys", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, "utf8");

const pathToPublicKey = path.join(__dirname, "..", "keys", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPublicKey, "utf8");

export function issueJWT(userId: String) {
  const _id = userId;
  const payload = {
    sub: _id,
    iat: Date.now(),
    exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
  };

  return jwt.sign(payload, PRIV_KEY, { algorithm: "RS256" });
}

export function verifyJWT(token: string) {
  return jwt.verify(token, PUB_KEY, {
    algorithm: "RS256",
  } as VerifyOptions);
}
export const jwtOptions: CookieOptions = {
  sameSite: "none",
  domain: process.env.DOMAIN,
  secure: true,
  maxAge: 1000000 * 60 * 15, // would expire after 15 minutes
  httpOnly: true, // The cookie only accessible by the web server
  // Indicates if the cookie should be signed
};
