import BlockedUser from '../models/blockedUser';

export async function getBlockedUser(phone: string) {
  return await BlockedUser.findOne({ phone: phone }).then((blockedUser) => {
    return blockedUser;
  });
}

export async function getBlockedUserFromUser(userId: string) {
  return await BlockedUser.findOne({ userId: userId }).then((blockedUser) => {
    return blockedUser;
  });
}
