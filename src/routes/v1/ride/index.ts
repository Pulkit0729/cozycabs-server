import { Router } from 'express';
import { getRide } from '../../../dal/ride.dal';
import logger from '../../../logger/logger';
import { getBookingsFromRide } from '../../../dal/booking.dal';

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

module.exports = router;