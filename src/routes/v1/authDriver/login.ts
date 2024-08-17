import Router from 'express';
import { getIdPass } from '../../../utils/decode.util';
import { issueJWT, jwtOptions } from '../../../utils/jwt.util';
import {
  getDriverFromEmail,
  getDriverFromPhone,
} from '../../../dal/driver.dal';
import Driver from '../../../models/drivers';
import logger from '../../../logger/logger';
import { validPassword } from '../../../utils/user.util';
import { sendOTP } from '../../../services/external/mcentral';

const driverRouter = Router();

driverRouter.get('/', (_req: any, res) => {
  //   logger.log({
  //     level: "warn",
  //     message: `Invalid GET request, ip: ${IP.address()} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
  //   });
  res.send('No GET Login Request');
});

driverRouter.post('/', async (req, res) => {
  const { email, password } = getIdPass(req.headers);
  try {
    const driver: any = await getDriverFromEmail(email);
    if (!driver) throw new Error('Driver not found');
    if (!driver.emailConfirmed) throw new Error('Email is not confirmed');
    const isValid = validPassword(password, driver.hash, driver.salt);
    if (!isValid) throw new Error('Invalid password');
    const token = issueJWT(driver.driverId);

    const driverData = {
      name: driver.name,
      email: driver.email,
      firstName: driver.firstName,
      lastName: driver.lastName,
    };
    return res.cookie('jwt', token, jwtOptions).status(200).json({
      success: true,
      driver: driverData,
    });
  } catch (error: any) {
    // logger.log({
    //   level: "error",
    //   message: `Login API, ip: ${IP.address()} error: ${error.message}, email: ${email} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    // });
    return res.json({ success: false, msg: error.message });
  }
});
driverRouter.post('/phone', async (req, res) => {
  const { phone } = req.body;
  const formattedPhone = '91' + phone.trim();

  try {
    let driver = await getDriverFromPhone(formattedPhone);
    if (!driver) {
      driver = new Driver({
        phone: formattedPhone as string,
        phoneConfirmed: false,
      });
      driver.save();
    }
    const vId = await sendOTP(phone);
    if (!vId) throw new Error(`Error sending otp`);
    driver.phoneVerificationId = vId;
    driver.markModified('phoneVerificationId');
    await driver.save();
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

module.exports = driverRouter;
