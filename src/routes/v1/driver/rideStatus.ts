import Router from "express";
import driverAuthMiddle from "../../../middlewares/driverAuthMiddle";
import { getRide } from "../../../dal/ride.dal";
import { RideStatus } from "../../../utils/constants";
import logger from "../../../logger/logger";
const router = Router();

router.post("/", driverAuthMiddle, async (req, res) => {
    const { driver, ride_id, status, location_url } = req.body;
    try {
        let ride = await getRide(ride_id);
        if (!ride) throw new Error("Ride not found");
        if (driver.id != ride.driver.id) throw new Error("Unauthenticated driver");
        switch (status) {
            case RideStatus.cancel:
                ride.status = RideStatus.cancel;
                break;
            case RideStatus.end:
                ride.status = RideStatus.end;
                break;
            case RideStatus.active:
                ride.status = RideStatus.active;
                ride.location_url = location_url;
                break;
            default:
                break;
        }
        ride.save();
        return res.status(200).json({ success: true, message: "Ride Stautus Updated successfully" });
    } catch (error: any) {
        logger.error(`Ride Status API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
        );
        return res.send({ success: false, msg: "Unable to update status" });
    }
});

module.exports = router;
