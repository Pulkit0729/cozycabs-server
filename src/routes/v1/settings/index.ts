import { Router } from 'express';
import authMiddle from '../../../middlewares/authMiddle';
import { SettingsController } from './settings.controller';

const router = Router();
router.post('/accountDelete', authMiddle, SettingsController.deleteAccount);

module.exports = router;
