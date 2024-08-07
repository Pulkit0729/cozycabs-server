import { Router } from 'express';
import logger from '../../logger/logger';
import { getRide } from '../../dal/ride.dal';
import { getBooking } from '../../dal/booking.dal';
import authMiddle from '../../middlewares/authMiddle';
import { passengerCancelledNotification } from '../../utils/notifications';
import { IRide } from '../../models/rides';
import { sendNotification } from '../../services/firebase';

const router = Router();


router.post('/', authMiddle, async (req, res) => {
    try {
        let {
            user, booking_id
        } = req.body;
        let booking = await getBooking(booking_id);
        if (!booking) throw new Error(`Booking ${booking_id} not found`);
        if (booking.user.toString() != user._id) throw new Error(`Unauthenticated booking cancellation`);
        let ride = await getRide(booking.ride.id.toString());
        if (!ride) throw new Error(`Ride does not exist`);
        ride.seats = ride.seats + booking.seats;
        await ride.save()
        booking.isCancelled = true;
        await booking.save();

        let driverFcm = ride.driver.fcm?.value;
        if (driverFcm) {
            let message = passengerCancelledNotification(driverFcm.toString(), ride as unknown as IRide, user);
            await sendNotification(message);
        }


        logger.log({ level: "info", message: "Cancelled Successfully" + booking })
        return res.json({ success: true, data: booking });
    } catch (error: any) {
        logger.error(`Cancel error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
        );
        return res.send({ success: false, msg: "Failed to Cancel" });
    }
})


module.exports = router;