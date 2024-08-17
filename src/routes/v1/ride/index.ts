import { Router } from 'express';
import { getRide } from '../../../dal/ride.dal';
import logger from '../../../logger/logger';
import { getBooking, getBookingsFromRide } from '../../../dal/booking.dal';
import driverAuthMiddle from '../../../middlewares/driverAuthMiddle';
import { RideController } from './ride.controller';

const router = Router();
router.get('/', async (req, res) => {
  const { id } = req.query;
  try {
    const ride = await getRide(id as string);
    const bookings = await getBookingsFromRide(ride?.rideId.toString()!, false);
    const passengers = bookings.map((booking) => booking.user);
    const jsonRide = JSON.parse(JSON.stringify(ride));
    jsonRide['passengers'] = passengers;
    return res.status(200).json({ success: true, ride: jsonRide });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/navigation', async (req, res) => {
  const { id, bookingId } = req.query;
  try {
    if (id) {
      const ride = await getRide(id as string);
      if (!ride) throw new Error('Invalid Ride ID');

      return res.status(200).json({
        success: true,
        data: {
          navigationStatus: ride?.navigationStatus,
          currentLocation: ride?.driver.currentLocation,
          fromLocation: ride.fromLocation,
          toLocation: ride.toLocation,
        },
      });
    } else if (bookingId) {
      const booking = await getBooking(bookingId as string);
      if (!booking) throw new Error('Invalid booking ID');
      return res.status(200).json({
        success: true,
        data: {
          navigationStatus: booking.ride?.navigationStatus,
          currentLocation: booking?.ride.driver.currentLocation,
          fromLocation: booking.ride.fromLocation,
          toLocation: booking.ride.toLocation,
        },
      });
    }
    throw new Error('Invalid booking ID');
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/status', driverAuthMiddle, RideController.updateRideStatus);

module.exports = router;
