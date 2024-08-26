import Router from 'express';
import { issueJWT } from '../../../utils/jwt.util';
import { getDriverFromPhone } from '../../../dal/driver.dal';
import logger from '../../../logger/logger';
import { flowTypes } from '../../../utils/constants';
import { verifyOTP } from '../../../services/external/mcentral';
import auditLogger from '../../../logger/auditLogger';
const router = Router();

router.post('/otp', async (req, res) => {
  const { otp, phone } = req.body;
  const formattedPhone = '91' + phone.trim();
  try {
    const driver = await getDriverFromPhone(formattedPhone);
    let flowType = flowTypes.login;
    if (!driver || !driver?.phoneVerificationId)
      throw new Error('Invalid phone or Otp');
    const isVerified = await verifyOTP(
      driver.phoneVerificationId,
      parseInt(otp)
    );
    if (!isVerified) throw new Error('Invalid phone or Otp');
    const token = issueJWT(driver.driverId.toString());
    let payload: any = {
      token,
      phone,
    };
    if (!driver.phoneConfirmed || !driver.name) {
      driver.markModified('phoneConfirmed');
      driver.phoneConfirmed = true;
      await driver.save();
      flowType = flowTypes.createUser;
    } else {
      payload = { ...payload, user: driver };
      flowType = flowTypes.login;
    }
    payload.flowType = flowType;
    auditLogger.info('Driver login', {
      eventType: 'Driver Login',
      eventCreatedBy: driver.driverId,
      description: 'Driver successfully logged in',
      timestamp: new Date().toISOString(),
      ip:
        req.headers['x-real-ip'] ||
        req.headers['x-forwared-for'] ||
        req.socket.remoteAddress ||
        '',
    });
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

// router.get('/:token', async (req, res) => {
//   const token = req.params.token;

//   try {
//     verifyJWT(token);
//     // const driver = await updateDriverConfirm(verify.sub);
//     // console.log(driver);

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
