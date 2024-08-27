import Router from 'express';
import TrackController from './track.controller';

const router = Router();

router.post('/book', TrackController.book);

module.exports = router;
