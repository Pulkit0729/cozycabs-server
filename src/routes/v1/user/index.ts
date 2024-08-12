import Router from 'express';
const router = Router();

router.use('/userInfo', require('./userInfo'));
router.use('/fcm', require('./fcm'));

module.exports = router;
