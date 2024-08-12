import Router from 'express';
import logger from '../../../logger/logger';
import driverAuthMiddle from '../../../middlewares/driverAuthMiddle';
import Driver from '../../../models/drivers';

const router = Router();

router.post('/', driverAuthMiddle, async (req, res) => {
  const driver = req.body.user;
  const { fcm } = req.body;
  try {
    if (fcm === undefined || fcm === null) throw new Error('FCM missing');
    await Driver.updateOne(
      { email: driver.email },
      { $set: { fcm: { value: fcm, timestamp: new Date() } } }
    );
    return res.json({
      success: true,
      user: driver,
    });
  } catch (error: any) {
    logger.error(
      `Save FCM API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
    return res.send({ success: false, msg: 'Unable to Save FCM' });
  }
});

module.exports = router;
