import Router from 'express';
import AdminController from './admin.controller';
import adminAuthMiddle from '../../../middlewares/adminMiddleware';

const router = Router();

router.post('/book', adminAuthMiddle, AdminController.book);
router.post('/cancel', adminAuthMiddle, AdminController.cancel);
router.post('/ride/cancel', adminAuthMiddle, AdminController.cancelRide);
router.post('/publish', adminAuthMiddle, AdminController.publish);

module.exports = router;
