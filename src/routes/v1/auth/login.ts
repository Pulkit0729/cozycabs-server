import Router from 'express';
import { getUserFromPhone } from '../../../dal/user.dal';
import User from '../../../models/users';
import logger from '../../../logger/logger';
import { sendOTP } from '../../../services/external/mcentral';
import auditLogger from '../../../logger/auditLogger';
const userRouter = Router();

// userRouter.get('/', (_req: any, res) => {
//   //   logger.log({
//   //     level: "warn",
//   //     message: `Invalid GET request, ip: ${IP.address()} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
//   //   });
//   res.send('No GET Login Request');
// });

// userRouter.post('/', async (req, res) => {
//   const { email, password } = getIdPass(req.headers);
//   try {
//     const user: any = await getUserFromEmail(email);
//     if (!user) throw new Error('User not found');
//     if (!user.emailConfirmed) throw new Error('Email is not confirmed');
//     const isValid = validPassword(password, user.hash, user.salt);
//     if (!isValid) throw new Error('Invalid password');
//     const token = issueJWT(user.userId);

//     const userData = {
//       name: user.name,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//     };

//     return res.cookie('jwt', token, jwtOptions).status(200).json({
//       success: true,
//       user: userData,
//     });
//   } catch (error: any) {
//     // logger.log({
//     //   level: "error",
//     //   message: `Login API, ip: ${IP.address()} error: ${error.message}, email: ${email} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
//     // });
//     return res.json({ success: false, msg: error.message });
//   }
// });
userRouter.post('/phone', async (req, res) => {
  const { phone } = req.body;
  try {
    const formattedPhone = '91' + phone.trim();
    let user = await getUserFromPhone(formattedPhone);
    if (!user) {
      user = new User({ phone: formattedPhone, phoneConfirmed: false });
    }
    if (user.phone === process.env.DUMMY_USER) {
      return res.status(200).json({
        success: true,
        message: 'Otp Send to phone',
      });
    }
    const vId = await sendOTP(phone);
    if (!vId) throw new Error(`Error sending otp`);
    user.phoneVerificationId = vId;
    user.markModified('phoneVerificationId');
    await user.save();
    auditLogger.info('OTP sent to user', {
      eventType: 'Login Attempt',
      eventCreatedBy: user.userId,
      description: `OTP sent to the user with phone number ${formattedPhone}`,
      timestamp: new Date().toISOString(),
      ip:
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        '',
    });

    return res.status(200).json({
      success: true,
      message: 'Otp Send to phone',
    });
  } catch (error: any) {
    logger.error(
      `Login API, error: ${error.message}, phone: ${phone} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
    return res.json({ success: false, message: error.message });
  }
});

module.exports = userRouter;
