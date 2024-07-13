import { Router } from 'express';
import { cancelRide, getRide } from '../../../dal/ride.dal';
import logger from '../../../logger/logger';
import { cancelBookings, getBooking, getBookingsFromRide } from '../../../dal/booking.dal';
import driverAuthMiddle from '../../../middlewares/driverAuthMiddle';

const router = Router();
router.get('/', async (req, res) => {
    const { id } = req.query;
    try {
        let ride = await getRide(id as string);
        let bookings = await getBookingsFromRide(ride?.id, false);
        let passengers = bookings.map(booking => booking.user);
        let jsonRide = JSON.parse(JSON.stringify(ride));
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
            let ride = await getRide(id as string);
            if (!ride) throw new Error('Invalid Ride ID');

            return res.status(200).json({ success: true, data: { navigationStatus: ride?.navigationStatus, currentLocation: ride?.driver.currentLocation, from_location: ride.from_location, to_location: ride.to_location } });
        } else if (bookingId) {
            let booking = await getBooking(bookingId as string);
            if (!booking) throw new Error('Invalid booking ID');
            return res.status(200).json({ success: true, data: { navigationStatus: booking.ride?.navigationStatus, currentLocation: booking?.ride.driver.currentLocation, from_location: booking.ride.from_location, to_location: booking.ride.to_location } });
        }
        throw new Error('Invalid booking ID');

    } catch (error: any) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;