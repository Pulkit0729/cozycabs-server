import { Router } from 'express';
import { addRides } from '../../rideCron';
import logger from '../../logger/logger';

const router = Router();

router.post('/', async (_req, res) => {
  try {
    await addRides();
    res.json({ success: true, message: 'Rides Published' });
  } catch (error) {
    logger.log({ level: 'info', message: 'Rides Published' + error });
    res.json({ success: false, error: error });
  }
});
module.exports = router;
