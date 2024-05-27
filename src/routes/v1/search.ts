import { Router } from 'express';
import Ride from '../../models/rides';
import { RideStatus } from '../../utils/constants';
import logger from '../../logger/logger';

const router = Router();
router.post('/', async (req, res) => {
    const { from, to, date, seats } = req.body;
    try {
        let rides = await Ride.find({
            from: from, to: to, date: date, status: RideStatus.pending, seats: { $gte: seats }
        });
        return res.status(200).json({ success: true, data: rides });
    } catch (error: any) {
        logger.error(error.message);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;