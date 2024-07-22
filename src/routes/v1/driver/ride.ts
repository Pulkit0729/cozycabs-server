import { ILocation } from '../../../models/templatedRides';
import Router from "express";
import driverAuthMiddle from "../../../middlewares/driverAuthMiddle";
import { getRide } from "../../../dal/ride.dal";
import { NavigationStatus, RideStatus } from "../../../utils/constants";
import logger from "../../../logger/logger";
import { cancelBookings, getBookingsFromRide, updateBookings } from "../../../dal/booking.dal";
import { createRideNavStatusNotification, createRideStatusNotification } from "../../../utils/notifications";
import { IRide } from "../../../models/rides";
import { sendNotification } from "../../../services/firebase";
const router = Router();

router.post("/status", driverAuthMiddle, async (req, res) => {
    const { user, ride_id, status } = req.body;
    try {
        let ride = await getRide(ride_id);
        if (!ride) throw new Error("Ride not found");
        if (user.id != ride.driver.id) throw new Error("Unauthenticated driver");
        ride.status = status;
        switch (status) {
            case RideStatus.cancelled:
                await cancelBookings(ride?.id);
                break;
            case RideStatus.ended:
                break;
            case RideStatus.active:
                break;
            default:
                break;
        }
        await updateBookings(ride?.id, status);
        let bookings = await getBookingsFromRide(ride.id);
        for (let booking of bookings) {
            let userFcm = booking.user.fcm?.value;
            if (userFcm) {
                let message = createRideStatusNotification(userFcm.toString(), ride as unknown as IRide);
                await sendNotification(message);
            }
        }

        let driverFcm = ride.driver.fcm?.value;
        if (driverFcm) {
            let message = createRideStatusNotification(driverFcm.toString(), ride as unknown as IRide);
            await sendNotification(message);
        }
        ride.markModified('status');
        await ride.save();
        return res.status(200).json({ success: true, message: "Ride Stautus Updated successfully" });
    } catch (error: any) {
        logger.error(`Ride Status API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
        );
        return res.send({ success: false, msg: "Unable to update status" });
    }
});

router.post("/navstatus", driverAuthMiddle, async (req, res) => {
    const { user, ride_id, navstatus } = req.body;
    try {
        let ride = await getRide(ride_id);
        if (!ride) throw new Error("Ride not found");
        if (user.id != ride.driver.id) throw new Error("Unauthenticated driver");
        ride.navigationStatus = navstatus;
        let bookings = await getBookingsFromRide(ride.id);
        for (let booking of bookings) {
            let userFcm = booking.user.fcm?.value;
            if (userFcm) {
                let message = createRideNavStatusNotification(userFcm.toString(), ride as unknown as IRide, navstatus);
                if (message) await sendNotification(message);
            }
        }

        let driverFcm = ride.driver.fcm?.value;
        if (driverFcm) {
            let message = createRideStatusNotification(driverFcm.toString(), ride as unknown as IRide);
            await sendNotification(message);
        }
        ride.markModified('navigationStatus');
        await ride.save();
        return res.status(200).json({ success: true, message: "Ride Navigation Status Updated successfully" });
    } catch (error: any) {
        logger.error(`Ride Status API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
        );
        return res.send({ success: false, msg: "Unable to update status" });
    }
});



module.exports = router;
