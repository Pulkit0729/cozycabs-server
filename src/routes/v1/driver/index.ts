import Router from 'express';
const router = Router();

router.use('/driverInfo', require('./driverInfo'));
router.use('/location', require('./location'));
router.use('/ride', require('./ride'));
router.use('/fcm', require('./fcm'));

module.exports = router;
