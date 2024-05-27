import User from "../models/users";

export async function getUser(id: string) {
  return await User.findOne({ _id: id }).then((user) => {
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
