import { Router } from 'express';

const router = Router();
// router.use('/signup', require('./signup'));
router.use('/verify', require('./verify'));
router.use('/login', require('./login'));
router.use('/islogin', require('./islogin'));

module.exports = router;
