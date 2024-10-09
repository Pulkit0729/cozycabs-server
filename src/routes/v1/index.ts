import { Router } from 'express';

const router = Router();

// router.get('/notif', async (_req, res) => {
//     let message : Message = {
//         "notification": {
//             "body": "This week's edition is now available.",
//             "title": "Test",
//         },
//         "android": {
//             "priority": "high"
//         },
//         "apns": {
//             "headers": {
//                 "apns-priority": "5"
//             }
//         },
//         "webpush": {
//             "headers": {
//                 "Urgency": "high"
//             }
//         },
//         token: 'eapOLeYFQVuBGbF5jStn8u:APA91bEC15goPVpDjecGsgAXuJ-LVK8aZYGSl1Zs75ElJCa6WwCmHMWRMH7zjp1aveLLgKKzdC6VfPiTiz3yFbDyaBRiaSQri1Zqiyb-Y-V10umTsVZzf7-8QrOJvCK8SyDWZ4WENIlL'
//     };
//     const response = await sendNotification(message);
//     res.send(response);
// })
router.use('/admin', require('./admin'));
router.use('/auth', require('./auth'));
router.use('/authDriver', require('./authDriver'));
router.use('/user', require('./user'));
router.use('/driver', require('./driver'));
router.use('/bot', require('./bot'));
router.use('/booking', require('./booking'));
router.use('/metadata', require('./metadata'));
router.use('/search', require('./search'));
router.use('/ride', require('./ride'));
router.use('/userpromo', require('./userpromo'));
router.use('/referral', require('./referral'));
router.use('/track', require('./track'));
router.use('/settings', require('./settings'));
router.use('/review', require('./review'));

module.exports = router;
