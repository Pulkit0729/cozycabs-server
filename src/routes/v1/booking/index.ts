import { Router } from 'express';
import authMiddle from '../../../middlewares/authMiddle';
import { BookingControlller } from './booking.controller';

const router = Router();

router.post('/', authMiddle, BookingControlller.book);
router.post('/cancel', authMiddle, BookingControlller.cancel);
router.post('/verify', authMiddle, BookingControlller.verify);

module.exports = router;
