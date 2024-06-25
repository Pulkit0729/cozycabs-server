import { Router } from 'express';
import logger from '../../logger/logger';
import { addRides } from '../../ride_cron';
import { createRideStatusNotification } from '../../utils/notifications';
import { sendNotification } from '../../services/firebase';
import { Message } from 'firebase-admin/messaging';

const router = Router();

router.post('/publishrides', async (_req, res) => {
    try {
        await addRides();
        res.json({ success: true, message: "Rides Published" });
    } catch (error) {
        logger.log({ level: "info", message: "Rides Published" + error })
        res.json({ success: false, error: error });
    }

});

router.get('/notif', async (_req, res) => {
    let message : Message = {
        "notification": {
            "body": "This week's edition is now available.",
            "title": "Test",
        },
        "android": {
            "priority": "high"
        },
        "apns": {
            "headers": {
                "apns-priority": "5"
            }
        },
        "webpush": {
            "headers": {
                "Urgency": "high"
            }
        },
        token: 'eapOLeYFQVuBGbF5jStn8u:APA91bEC15goPVpDjecGsgAXuJ-LVK8aZYGSl1Zs75ElJCa6WwCmHMWRMH7zjp1aveLLgKKzdC6VfPiTiz3yFbDyaBRiaSQri1Zqiyb-Y-V10umTsVZzf7-8QrOJvCK8SyDWZ4WENIlL'
    };
    const response = await sendNotification(message);
    res.send(response);
})


router.use('/auth', require('./auth'));
router.use('/authDriver', require('./authDriver'));
router.use('/user', require('./user'));
router.use('/driver', require('./driver'));
router.use('/bot', require('./bot'));
router.use('/book', require('./book'));
router.use('/cancel', require('./cancel'));
router.use('/metadata', require('./metadata'));
router.use('/search', require('./search'));
router.use('/ride', require('./ride'));

module.exports = router;