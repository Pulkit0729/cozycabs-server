import Router from "express";
import logger from "../../../logger/logger";
import authMiddle from "../../../middlewares/authMiddle";
import User from "../../../models/users";

const router = Router();

router.post("/", authMiddle, async (req, res) => {
    const user = req.body.user;
    const { fcm } = req.body;
    try {
        if (fcm === undefined || fcm === null) throw new Error("FCM missing");
        await User.updateOne({ email: user.email }, { $set: { fcm: { value: fcm, timestamp: new Date() } } });
        return res.json({
            success: true,
            user: user,
        });
    } catch (error: any) {
        logger.error(`Save FCM API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
        );
        return res.send({ success: false, msg: "Unable to Save FCM" });
    }
});

module.exports = router;
