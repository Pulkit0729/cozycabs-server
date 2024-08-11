import Router from 'express';
import { UserPromoControlller } from './userpromo.controller';
import authMiddle from '../../../middlewares/authMiddle';
const router = Router();

router.post('/', UserPromoControlller.addPromo);
router.get('/', authMiddle, UserPromoControlller.getUserPromos);

module.exports = router;
