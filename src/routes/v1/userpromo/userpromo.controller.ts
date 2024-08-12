import { Request, Response } from 'express';
import { getPromo } from '../../../dal/promo.dal';
import { getUser } from '../../../dal/user.dal';
import { getValidUserPromo } from '../../../dal/userPromo.dal';
import logger from '../../../logger/logger';
import { UserPromoService } from '../../../services/userpromo.service';

export class UserPromoControlller {
  static async addPromo(req: Request, res: Response) {
    const { userId, promoId, validDays } = req.body;
    try {
      const promo = await getPromo(promoId);
      if (!promo) throw new Error('Promo not found');
      const user = await getUser(userId);
      if (!user) throw new Error('Promo not found');
      const userPromo = await UserPromoService.addPromoToUser(
        user,
        promo,
        validDays
      );
      return res
        .status(200)
        .json({ success: true, message: 'Promo Updated', promo: userPromo });
    } catch (error: any) {
      logger.error(
        `Promo Update API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
      );
      return res.send({ success: false, message: 'Unable to update Promo' });
    }
  }

  static async getUserPromos(req: Request, res: Response) {
    const { user } = req.body;
    try {
      const userPromos = await getValidUserPromo(user.id);
      return res.status(200).json({ success: true, data: userPromos });
    } catch (error: any) {
      logger.error(
        `Promo API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
      );
      return res.send({ success: false, message: 'Unable to fetch Promo' });
    }
  }
}
