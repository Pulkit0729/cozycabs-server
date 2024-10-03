import { Router } from 'express';
import { VerifyController } from './verify.controller';

const router = Router();
router.post('/otp', VerifyController.verifyOtp);

module.exports = router;
