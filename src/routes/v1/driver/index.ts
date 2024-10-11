import Router from 'express';
import { DriverController } from './driver.controller';
import driverAuthMiddle from '../../../middlewares/driverAuthMiddle';
const router = Router();

router.use('/driverInfo', require('./driverInfo'));
router.use('/location', require('./location'));
router.use('/ride/navstatus', driverAuthMiddle, DriverController.rideStatus);
router.use('/fcm', require('./fcm'));

module.exports = router;
