import { Request, Response } from 'express';
import { getTermsAndConditionsFromName } from '../../../dal/termsAndConditions.dal';
import logger from '../../../logger/logger';
import { searchBooking } from '../../../dal/booking.dal';
import { searchUser } from '../../../dal/user.dal';
import {
  getUserPromoBySource,
  searchUserPromos,
} from '../../../dal/userPromo.dal';
import { PromoSources } from '../../../models/promos';
import { searchPromo } from '../../../dal/promo.dal';
import { UserPromoService } from '../../../services/userpromo.service';
import { maxNoOfReferral } from '../../../utils/constants';

export class ReferralController {
  static async getReferraDetails(req: Request, res: Response) {
    const { user } = req.body;
    try {
      const termsAndConditions =
        await getTermsAndConditionsFromName('referral');
      const refLink = `https://app.cozycabs.in/referral?code=${user.referralCode}`;
      const message = `Hey! Found an amazing deal for you. Rs50 off Coupon on your first booking from Cozycabs. Tap the link to claim the offer: ${refLink}`;
      return res
        .status(200)
        .json({ success: true, termsAndConditions, message, url: refLink });
    } catch (error: any) {
      logger.error(error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async validateAndApplyReferral(req: Request, res: Response) {
    const { user, referralCode } = req.body;
    try {
      const booking = await searchBooking({
        user: user.id,
        isCancelled: false,
      });
      if (booking) throw new Error('User is already a customer');
      const referalUser = await searchUser({ referralCode: referralCode });
      if (referalUser == null || referalUser.id == user.id)
        throw new Error('Invalid referral code');

      const referredPromos = await searchUserPromos({
        referredFrom: referalUser.id,
      });
      if (referredPromos.length >= maxNoOfReferral)
        throw new Error('Maximum number of referral exceeded');

      const userPromos = await getUserPromoBySource(
        user.id,
        PromoSources.REFERRAL
      );
      if (userPromos) throw new Error('Referral already exists');
      const promo = await searchPromo({
        name: 'NEW50',
        source: PromoSources.REFERRAL,
      });
      if (!promo) throw new Error('No promotion found');

      const userPromo = await UserPromoService.addPromoToUser(user, promo, 365);
      return res.json({ success: true, userPromos: userPromo });
    } catch (error: any) {
      logger.error(error.message);
      return res.json({ success: false, error: error.message });
    }
  }
}
