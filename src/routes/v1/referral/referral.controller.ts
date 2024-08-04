import { NextFunction, Request, Response } from "express";
import { getTermsAndConditionsFromName } from "../../../dal/termsAndConditions.dal";
import logger from "../../../logger/logger";
import { searchBooking } from "../../../dal/booking.dal";
import { searchUser } from "../../../dal/user.dal";
import { getUserPromoByUser } from "../../../dal/userPromo.dal";
import { PromoSources } from "../../../models/promos";
import { getPromo, searchPromo } from "../../../dal/promo.dal";
import { UserPromoControlller } from "../userpromo/userpromo.controller";


export class ReferralController {
    static async getReferraDetails(req: Request,
        res: Response) {
        const { user } = req.body;
        try {
            let termsAndConditions = await getTermsAndConditionsFromName('referral');
            let refLink = `https://app.cozycabs.in/referral?code=${user.referralCode}`;
            let message = `Hey! Found an amazing deal for you. Rs50 off Coupon on your first booking from Cozycabs. Tap the link to claim the offer: ${refLink}`
            return res.status(200).json({ success: true, termsAndConditions, message, url: refLink });
        } catch (error: any) {
            logger.error(error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    static async validateAndApplyReferral(req: Request,
        res: Response) {
        const { user, referralCode } = req.body;
        try {
            const booking = await searchBooking({ user: user.id, is_cancelled: false });
            if (booking) throw new Error('User is already a customer');
            const referalUser = await searchUser({ referralCode: referralCode });
            if (referalUser == null || referalUser.id == user.id) throw new Error('Invalid referral code');
            const userPromos = await getUserPromoByUser(user.id);
            if (userPromos) {
                if (userPromos.promos.find(promo => promo.source == PromoSources.REFERRAL)) {
                    throw new Error('Referral already exists');
                };
            }

            let promo = await searchPromo({ name: 'NEW50', source: PromoSources.REFERRAL });
            if (!promo) throw new Error('No promotion found');
            let userPromo = await UserPromoControlller.addPromoToUser(user, promo as any, 365);
            userPromo.referredFrom = referralCode;
            userPromo.markModified('referredFrom');
            await userPromo?.save();
            return res.json({ success: true, userPromos: userPromos });

        } catch (error: any) {
            logger.error(error.message);
            return res.json({ success: false, error: error.message });
        }
    }


}