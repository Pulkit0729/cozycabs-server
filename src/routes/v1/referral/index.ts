import { Router } from 'express';
import logger from '../../../logger/logger';
import authMiddle from '../../../middlewares/authMiddle';
import { getTermsAndConditionsFromName } from '../../../dal/termsAndConditions.dal';
import { ReferralController } from './referral.controller';

const router = Router();
router.get('/details', authMiddle, ReferralController.getReferraDetails);

router.post('/apply', authMiddle, ReferralController.validateAndApplyReferral);


module.exports = router;