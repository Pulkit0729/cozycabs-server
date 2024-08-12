import Router from 'express';
import driverAuthMiddle from '../../../middlewares/driverAuthMiddle';
import { getRide } from '../../../dal/ride.dal';
import logger from '../../../logger/logger';
import { getBookingsFromRide } from '../../../dal/booking.dal';
import {
  createRideNavStatusNotification,
  createRideStatusNotification,
} from '../../../utils/notifications';
import { IRide } from '../../../models/rides';
import { sendNotification } from '../../../services/external/firebase';
const router = Router();

router.post('/navstatus', driverAuthMiddle, async (req, res) => {
  const { user, ride_id, navstatus } = req.body;
  try {
    const ride = await getRide(ride_id);
    if (!ride) throw new Error('Ride not found');
    if (user.id != ride.driver.id) throw new Error('Unauthenticated driver');
    ride.navigationStatus = navstatus;
    const bookings = await getBookingsFromRide(ride.id);
    for (const booking of bookings) {
      const userFcm = booking.user.fcm?.value;
      if (userFcm) {
        const message = createRideNavStatusNotification(
          userFcm.toString(),
          ride as unknown as IRide,
          navstatus
        );
        if (message) await sendNotification(message);
      }
    }

    const driverFcm = ride.driver.fcm?.value;
    if (driverFcm) {
      const message = createRideStatusNotification(
        driverFcm.toString(),
        ride as unknown as IRide
      );
      await sendNotification(message);
    }
    ride.markModified('navigationStatus');
    await ride.save();
    return res.status(200).json({
      success: true,
      message: 'Ride Navigation Status Updated successfully',
    });
  } catch (error: any) {
    logger.error(
      `Ride Status API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
    return res.send({ success: false, msg: 'Unable to update status' });
  }
});

module.exports = router;
