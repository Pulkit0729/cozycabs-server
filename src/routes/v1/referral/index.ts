import { Router } from 'express';
import authMiddle from '../../../middlewares/authMiddle';
import { ReferralController } from './referral.controller';

const router = Router();
router.get('/details', authMiddle, ReferralController.getReferraDetails);

router.post('/apply', authMiddle, ReferralController.validateAndApplyReferral);

module.exports = router;
