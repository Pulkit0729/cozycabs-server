import { Router } from 'express';
import { getUniqueFromToPlaces } from '../../dal/templateRide.dal';

const router = Router();
router.get('/', async (_req, res) => {
    let { from, to } = await getUniqueFromToPlaces();
    return res.status(200).json({ success: true, data: { from: from, to: to } });
});

module.exports = router;