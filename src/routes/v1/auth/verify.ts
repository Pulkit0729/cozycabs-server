import Router from 'express';
import { issueJWT } from '../../../utils/jwt.util';
import { genreferralCode } from '../../../utils/user.util';
import { getUserFromPhone } from '../../../dal/user.dal';
import logger from '../../../logger/logger';
import auditLogger from '../../../logger/auditLogger';
import { flowTypes } from '../../../utils/constants';
import { verifyOTP } from '../../../services/external/mcentral';
import { UserPromoService } from '../../../services/userpromo.service';
import { searchPromo } from '../../../dal/promo.dal';

const router = Router();

router.post('/otp', async (req, res) => {
  const { otp, phone } = req.body;

  try {
    const formattedPhone = '91' + phone.trim();
    const user = await getUserFromPhone(formattedPhone);
    let flowType = flowTypes.login;
    if (!user || !user?.phoneVerificationId)
      throw new Error('Invalid phone or Otp');
    if (
      user.phone === process.env.DUMMY_USER &&
      String(otp) == process.env.DUMMY_USER_OTP
    ) {
      const token = issueJWT(user.userId.toString());
      return res.status(200).json({
        success: true,
        data: { user, flowType: flowTypes.login, token },
      });
    } else {
      const isVerified = await verifyOTP(
        user.phoneVerificationId,
        parseInt(otp)
      );
      if (!isVerified) throw new Error('Invalid phone or Otp');
    }

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
      const promo = await searchPromo({
        name: process.env.WELCM_COUPON || 'WELCOM50',
      });
      if (promo) {
        await UserPromoService.addPromoToUser(user, promo, 365);
      }
      flowType = flowTypes.createUser;
      auditLogger.info('New user created', {
        eventType: 'User Registration',
        eventCreatedBy: user.userId,
        description: 'New user registered and confirmed phone number',
        timestamp: new Date().toISOString(),
        ip:
          req.headers['x-real-ip'] ||
          req.headers['x-forwared-for'] ||
          req.socket.remoteAddress ||
          '',
      });
    } else {
      payload = { ...payload, user: user };
      flowType = flowTypes.login;
      auditLogger.info('User login', {
        eventType: 'User Login',
        eventCreatedBy: user.userId,
        description: 'User successfully logged in',
        timestamp: new Date().toISOString(),
        ip:
          req.headers['x-real-ip'] ||
          req.headers['x-forwared-for'] ||
          req.socket.remoteAddress ||
          '',
      });
    }
    payload.flowType = flowType;
    return res.status(200).json({ success: true, data: payload });
  } catch (error: any) {
    logger.error(
      `OTP API, error: ${error.message}, phone: ${phone} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
    auditLogger.error('OTP verification failed', {
      eventType: 'OTP Verification',
      eventCreatedBy: 'System',
      description: `OTP verification failed for phone: ${phone}`,
      timestamp: new Date().toISOString(),
      ip:
        req.headers['x-real-ip'] ||
        req.headers['x-forwared-for'] ||
        req.socket.remoteAddress ||
        '',
    });
    return res.json({ success: false, message: error.message });
  }
});

// router.get('/jwt/:token', async (req, res) => {
//   const token = req.params.token;

//   try {
//     const verify: any = verifyJWT(token);
//     const user = await updateUserConfirm(verify.sub);
//     console.log(user);

//     // logger.log({
//     //   level: "info",
//     //   message: `Verify Token API, ip: ${IP.address()} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
//     // });
//     return res.redirect(`${process.env.SERVER_URL}`);
//   } catch (_error: any) {
//     // logger.log({
//     //   level: "error",
//     //   message: `Verify Token API, ip: ${IP.address()} error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
//     // });
//     return res.send('Url is invalid, PLease Try Again');
//   }
// });

module.exports = router;
