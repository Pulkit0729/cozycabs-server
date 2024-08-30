import { FilterQuery } from 'mongoose';
import User, { IUser } from '../models/users';

export async function getUser(userId: string) {
  return await User.findOne({ userId: userId }).then((user) => {
    return user;
  });
}
export async function getUserFromApiKey(apiKey: string) {
  return await User.findOne({ apiKey: apiKey }).then((user) => {
    return user;
  });
}

export async function getUserFromEmail(email: string) {
  return await User.findOne({ email: email }).then((user) => {
    return user;
  });
}

export async function getUserFromPhone(phone: string) {
  return await User.findOne({ phone: phone }).then((user) => {
    return user;
  });
}

export async function searchUser(filters: FilterQuery<IUser>) {
  return await User.findOne(filters).then((user) => {
    return user;
  });
}

export async function findOrCreateUser(params: FilterQuery<IUser>) {
  return await User.findOne(params).then(async (user) => {
    if (user) return user;
    else {
      const newUser = new User(params);
      await newUser.save();
      return newUser;
    }
  });
}
