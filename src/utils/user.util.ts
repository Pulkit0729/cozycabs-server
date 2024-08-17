import crypto, { BinaryLike } from 'crypto';
import { issueJWT } from './jwt.util';
import { mailOptions, verifyMail } from './mail';
import ejs from 'ejs';
import path from 'path';
import User from '../models/users';
import mongoose from 'mongoose';

export function validPassword(
  password: BinaryLike,
  hash: string,
  salt: BinaryLike
) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}

export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phonenumber: string
) {
  const newUser: any = new User({
    ...createNewUserObj(email, password, firstName, lastName, phonenumber),
  });

  const user: any = await User.findOne({ email: email }).then((user) => {
    return user;
  });
  if (!user) {
    await newUser.save();
  } else if (!!user && !user.emailConfirmed) {
    await User.deleteOne({ id: user.userId });
    await newUser.save();
  } else {
    throw new Error('Account already exists');
  }
  return newUser;
}

export function createNewUserObj(
  email: string,
  password: BinaryLike,
  firstName: string,
  lastName: string,
  phonenumber: string
) {
  const saltHash = genPassword(password);
  const referralCode = genreferralCode();

  const userObj = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    salt: saltHash.salt,
    hash: saltHash.hash,
    phonenumber: phonenumber,
    emailConfirmed: false,
    phoneConfirmed: false,
    referralCode: referralCode,
  };
  return userObj;
}

export function genPassword(password: BinaryLike) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return {
    salt: salt,
    hash: genHash,
  };
}

export function genreferralCode() {
  return crypto.randomBytes(6).toString('hex').toLocaleUpperCase();
}

export async function sendVerifEmail(userId: any, email: string) {
  const emailjwt = issueJWT(userId);
  const url = `${process.env.SERVER_URL}/v1/auth/verify/${emailjwt}`;
  const data = await ejs.renderFile(
    path.join(__dirname, '../', 'views/verifyEmail/index.ejs'),
    { verifyLink: url }
  );
  const mailOption = mailOptions(
    'yogeshagrawal061@gmail.com',
    email,
    'Account Verification',
    '',
    { 'x-myheader': 'test header' },
    data
  );
  verifyMail(mailOption);
}

export async function sendResetPasswordEmail(
  recoverToken: string,
  email: string
) {
  const url = `${process.env.WEB_URL}/recover/${recoverToken}`;
  const data = await ejs.renderFile(
    path.join(__dirname, '../', 'views/resetEmail/index.ejs'),
    { resetLink: url }
  );
  const mailOption = mailOptions(
    'support@alapi.co',
    email,
    'Password Reset Email',
    '',
    { 'x-myheader': 'test header' },
    data
  );
  verifyMail(mailOption);
}

export async function updateUserConfirm(id: string) {
  const user: any = await User.findOne({
    id: new mongoose.Types.ObjectId(id),
  });

  user.emailConfirmed = true;
  await user.save();
  return user;
}

export async function getUserFromEmail(email: string) {
  return await User.findOne({ email: email }).then((user) => {
    return user;
  });
}
