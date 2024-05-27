import { Router } from 'express';
import logger from '../../logger/logger';
import { addRides } from '../../ride_cron';

const router = Router();

router.post('/publishrides', async (_req, res) => {
    try {
        await addRides();
        res.json({ success: true, message: "Rides Published" });
    } catch (error) {
        logger.log({ level: "info", message: "Rides Published" + error })
        res.json({ success: false, error: error });
    }

});

router.use('/auth', require('./auth'));
router.use('/authDriver', require('./authDriver'));
router.use('/user', require('./user'));
router.use('/driver', require('./driver'));
router.use('/bot', require('./bot'));
router.use('/book', require('./book'));
router.use('/cancel', require('./cancel'));
router.use('/metadata', require('./metadata'));
router.use('/search', require('./search'));
router.use('/ride', require('./ride'));

module.exports = router;