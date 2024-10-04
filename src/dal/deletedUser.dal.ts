import DeletedUser from '../models/deletedUser';

export async function getDeletedUser(phone: string) {
  return await DeletedUser.findOne({ phone: phone }).then((deletedUser) => {
    return deletedUser;
  });
}

export async function getDeletedUserFromUser(userId: string) {
  return await DeletedUser.findOne({ userId: userId }).then((deletedUser) => {
    return deletedUser;
  });
}
