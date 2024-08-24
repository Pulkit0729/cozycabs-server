import { Router } from 'express';
import BotController from './bot.controller';
import botAuthMiddle from '../../../middlewares/botAuthMiddle';

const router = Router();
router.post('/token', botAuthMiddle, BotController.botAccessToken);
router.get('/verify', botAuthMiddle, BotController.verify);
router.post('/book', botAuthMiddle, BotController.bookFromBot);
router.post('/cancel', botAuthMiddle, BotController.cancelFromBot);

module.exports = router;
