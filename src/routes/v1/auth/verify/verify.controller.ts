import { Request, Response } from 'express';
import { getDeletedUser } from '../../../../dal/deletedUser.dal';
import { searchPromo } from '../../../../dal/promo.dal';
import { getUserFromPhone } from '../../../../dal/user.dal';
import logger from '../../../../logger/logger';
import { verifyOTP } from '../../../../services/external/mcentral';
import { UserPromoService } from '../../../../services/userpromo.service';
import { flowTypes } from '../../../../utils/constants';
import { issueJWT } from '../../../../utils/jwt.util';
import { genreferralCode } from '../../../../utils/user.util';
import User, { IUser } from '../../../../models/users';
import BlockedUser from '../../../../models/blockedUser';
export class VerifyController {
  static async verifyOtp(req: Request, res: Response) {
    const { otp, phone } = req.body;

    try {
      const formattedPhone = '91' + phone.trim();

      const demo = await VerifyController.handleDemoUser(otp, formattedPhone);
      if (demo) {
        return res.json({ success: true, data: demo });
      }

      const user = await getUserFromPhone(formattedPhone);

      let flowType = flowTypes.login;
      if (!user || !user?.phoneVerificationId)
        throw new Error('Invalid phone or Otp');
      if (await VerifyController.handleBlockedUser(user)) {
        throw new Error('User is blocked');
      }
      const isVerified = await verifyOTP(
        user.phoneVerificationId,
        parseInt(otp)
      );
      if (!isVerified) throw new Error('Invalid phone or Otp');

      const token = issueJWT(user.userId.toString());
      let payload: any = {
        token,
        phone,
      };
      if (!user.phoneConfirmed || !user.name || !user.accountCreated) {
        user.phoneConfirmed = true;
        user.referralCode = genreferralCode();
        user.markModified('phoneConfirmed');
        user.markModified('referralCode');
        await user.save();

        const deletedUser = await getDeletedUser(user.phone);
        if (!deletedUser) {
          const promo = await searchPromo({
            name: process.env.WELCM_COUPON || 'WELCOM50',
          });
          if (promo) {
            await UserPromoService.addPromoToUser(user, promo, 365);
          }
        }
        flowType = flowTypes.createUser;
      } else {
        payload = { ...payload, user: user };
        flowType = flowTypes.login;
      }
      payload.flowType = flowType;
      return res.status(200).json({ success: true, data: payload });
    } catch (error: any) {
      logger.error(
        `OTP API, error: ${error.message}, phone: ${phone} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
      );
      return res.json({ success: false, message: error.message });
    }
  }

  static async handleDemoUser(otp: string, phone: string) {
    if (
      phone === process.env.DUMMY_USER &&
      String(otp) == process.env.DUMMY_USER_OTP
    ) {
      let user = await getUserFromPhone(phone);
      if (!user) {
        user = new User({
          name: 'Demo',
          phone: phone,
          phoneConfirmed: true,
          accountCreated: true,
        });
        await user.save();
      }
      const token = issueJWT(user.userId.toString());
      return { user, flowType: flowTypes.login, token };
    }
    return undefined;
  }

  static async handleBlockedUser(user: IUser) {
    const blockedUser = await BlockedUser.findOne({
      userId: user.userId,
      isBlocked: true,
    });
    if (blockedUser) {
      return true;
    }
    return false;
  }
}
