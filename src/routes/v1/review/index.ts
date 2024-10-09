import { Router } from 'express';
import authMiddle from '../../../middlewares/authMiddle';
import { ReviewController } from './review.controller';

const router = Router();
router.post('/', authMiddle, ReviewController.addReview);
module.exports = router;
