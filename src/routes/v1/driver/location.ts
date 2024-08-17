import { Router } from 'express';
import { IDriver } from '../../../models/drivers';
import { Document, Schema } from 'mongoose';
import driverAuthMiddle from '../../../middlewares/driverAuthMiddle';
import { ILocation } from '../../../models/templatedRides';
import logger from '../../../logger/logger';

const router = Router();
router.post('/', driverAuthMiddle, async (req, res) => {
  const {
    driver,
    location,
  }: {
    driver: Document<unknown, {}, IDriver> &
      IDriver & {
        _id: Schema.Types.ObjectId;
      };
    location: any[];
  } = req.body;
  try {
    driver.currentLocation = {
      type: 'Point',
      coordinates: location,
    } as ILocation;
    driver.markModified('currentLocation');
    await driver.save();
    return res
      .status(200)
      .json({ success: true, message: 'Driver Location Updated successfully' });
  } catch (error: any) {
    logger.error(
      `Driver Location API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
    return res.send({
      success: false,
      msg: 'Unable to update Driver location',
    });
  }
});

module.exports = router;
