import { Router } from 'express';
import logger from '../../../logger/logger';
import Booking, { IBooking } from '../../../models/bookings';
import { IDriver } from '../../../models/drivers';
import Ride, { IRide } from '../../../models/rides';
import { IUser } from '../../../models/users';
import { book, cancel } from '../../../services/handlers';
import { sendToUser, eventType } from '../../../services/sendpulse';

const router = Router();
router.post('/book', async (req, res) => {
    try {
        let {
            user_name, user_phone, rideNo, seats
        } = req.body;
        let booking = await book(user_phone, user_name, seats, rideNo);
        logger.log({ level: "info", message: "Booking Complted" + booking })
        return res.json({ success: true, booking });
    } catch (error: any) {
        logger.log({ level: "error", message: "Booking Error" + error })
        return res.json({ success: false, error: error });
    }

});
router.post('/cancel', async (req, res) => {
    try {
        let {
            booking_id
        } = req.body;
        let booking = await Booking.findById(booking_id).populate<{ user: IUser }>('user');
        if (!booking) throw new Error(`Booking not found`);
        // Update ride with seats booked
        let ride = await cancel(booking.user.phone.toString()!, booking.ride.toString()!);
        logger.log({ level: "info", message: "Cancel Done" + ride })
        return res.json({ success: true, ride });
    } catch (error: any) {
        logger.log({ level: "error", message: "Cancel Error" + error })
        return res.json({ success: false, error: error });
    }

});
router.post('/start', async (req, res) => {
    try {
        let { rideNo, locationUrl } = req.body;
        let ride = await Ride.findOne({ rideNo: rideNo }).populate<{ driver: IDriver }>('Drivers');
        if (!ride) throw new Error(`No such ride`);
        ride.status = 'active';
        await ride.save();
        let bookings = await Booking.find({ ride_id: ride.id, isCancelled: false }).populate<{ user: IUser }>('Users');
        bookings.forEach(async (booking) => {
            booking.status = 'active';
            await booking.save();
            await sendToUser(eventType.ride_start, booking as unknown as IBooking, ride as unknown as IRide, booking.user, ride.driver, locationUrl);
        })
        logger.log({ level: "info", message: "Start Ride" + ride })
        res.json({ success: true, bookings });
    } catch (error) {
        logger.log({ level: "error", message: "Start Error" + error })
        res.json({ success: false, error: error });
    }

});
router.post('/end', async (req, res) => {
    try {
        let { rideNo } = req.body;
        let ride = await Ride.findOne({ rideNo: rideNo }).populate<{ driver: IDriver }>('Drivers');
        if (!ride) throw new Error(`No such ride`);
        ride.status = 'end';
        await ride.save();
        let bookings = await Booking.find({ ride_id: ride.id, isCancelled: false }).populate<{ user: IUser }>('Users');
        bookings.forEach(async (booking) => {
            booking.isPaid = true;
            booking.status = 'end';
            await booking.save();
            let des = await sendToUser(eventType.ride_end, booking as unknown as IBooking, ride as unknown as IRide, booking.user, ride.driver);
        });
        logger.log({ level: "error", message: "End Ride" + ride })
        res.json({ success: true, bookings });
    } catch (error) {
        logger.log({ level: "error", message: "End Error" + error })
        res.json({ success: false, error: error });
    }

});


module.exports = router;