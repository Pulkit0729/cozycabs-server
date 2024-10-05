import { Document } from 'mongoose';
import { IUser } from '../models/users';
import BlockedUser from '../models/blockedUser';

export class BlockUserService {
  static async validatedBlockUser(
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
    return;
  }
}
