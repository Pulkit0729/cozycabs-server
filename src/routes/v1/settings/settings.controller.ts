import { Request, Response } from 'express';
import DeletedUser from '../../../models/deletedUser';
import { deleteUser } from '../../../dal/user.dal';
import { IUser } from '../../../models/users';
import logger from '../../../logger/logger';

export class SettingsController {
  static async deleteAccount(req: Request, res: Response) {
    const { user, reason }: { user: IUser; reason: string } = req.body;
    try {
      const deletedUser = new DeletedUser({
        userId: user.userId,
        phone: user.phone,
        reason: reason,
        date: Date.now(),
      });
      await deletedUser.save();
      await deleteUser(user.userId.toString());
      return res.json({ success: true, message: 'success' });
    } catch (error: any) {
      logger.error(error);
      return res.json({ success: false, message: error.message });
    }
  }
}
