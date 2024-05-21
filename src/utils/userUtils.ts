import crypto, { BinaryLike } from "crypto";
import { issueJWT } from "./jwtUtils";
import { mailOptions,verifyMail } from "./mail";
import ejs from "ejs";
import path from "path";
import User from "../models/users"
import mongoose from "mongoose";

export function validPassword(
  password: BinaryLike,
  hash: String,
  salt: BinaryLike
) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}


export async function createUser(
  email: String,
  password: string,
  firstName: String,
  lastName :String,
  phoneNumber :String
) {
  const newUser: any = new User({
    ...createNewUserObj(email, password, firstName, lastName, phoneNumber),
  });

  const user: any = await User.findOne({ email: email }).then((user) => {
    return user;
  });
  if (!user) {
    await newUser.save();
  } else if (!!user && !user.emailConfirmed  ) {
    await User.deleteOne({ _id: user._id });
    await newUser.save();
  } else {
    throw new Error("Account already exists");
  }
  return newUser;
}

export function createNewUserObj(
  email: String,
  password: BinaryLike,
  firstName: String,
  lastName :String,
  phoneNumber : String
) {
  const saltHash = genPassword(password);

  const userObj = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    salt: saltHash.salt,
    hash: saltHash.hash,
    phoneNumber : phoneNumber,
    emailConfirmed: false,
    phoneConfirmed: false,
  };
  return userObj;
}

export function genPassword(password: BinaryLike) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}



export async function sendVerifEmail(userId: any, email: String) {
  

  const emailjwt = issueJWT(userId);
  const url = `${process.env.SERVER_URL}/v1/auth/verify/${emailjwt}`;
  const u = userId;
  const data = await ejs.renderFile(
    path.join(__dirname, "../", "views/verifyEmail/index.ejs"),
    { verifyLink: url }
  );
  const mailOption = mailOptions(
    "yogeshagrawal061@gmail.com",
    email,
    "Account Verification",
    "",
    { "x-myheader": "test header" },
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
    path.join(__dirname, "../", "views/resetEmail/index.ejs"),
    { resetLink: url }
  );
  const mailOption = mailOptions(
    'support@alapi.co',
    email,
    "Password Reset Email",
    "",
    { "x-myheader": "test header" },
    data
  );
  verifyMail(mailOption);
}

export async function updateUserConfirm(id: string) {
  const user: any = await User.findOne({
    _id: new mongoose.Types.ObjectId(id),
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