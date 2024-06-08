import { Router } from 'express';
import Ride from '../../models/rides';
import Booking from '../../models/bookings';
import logger from '../../logger/logger';
import { addRides } from '../../ride_cron';
import { book, cancel } from '../../services/handlers';
import { eventType, sendToUser } from '../../services/sendpulse';

const router = Router();
router.post('/book', async (req, res) => {
    try {
        let {
            user_name, user_phone, ride_no, seats
        } = req.body;
        let booking = await book(user_phone, user_name, seats, ride_no);
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
        let booking = await Booking.findById(booking_id);
        if (!booking) throw new Error(`Booking not found`);
        // Update ride with seats booked
        let ride = await cancel(booking.user_no!, booking.ride_id!);
        logger.log({ level: "info", message: "Cancel Done" + ride })
        return res.json({ success: true, ride });
    } catch (error: any) {
        logger.log({ level: "error", message: "Cancel Error" + error })
        return res.json({ success: false, error: error });
    }

});
router.post('/start', async (req, res) => {
    try {
        let { ride_no, location_url } = req.body;
        let ride = await Ride.findOne({ ride_no: ride_no });
        if (!ride) throw new Error(`No such ride`);
        ride.status = 'active';
        await ride.save();
        let bookings = await Booking.find({ ride_id: ride.id, is_cancelled: false });
        bookings.forEach(async (booking) => {
            booking.status = 'active';
            await booking.save();
            let des = await sendToUser(eventType.ride_start, JSON.parse(JSON.stringify(booking)), undefined, location_url);
        })
        logger.log({ level: "info", message: "Start Ride" + ride })
        res.json({ success: true, bookings });
    } catch (error) {
        logger.log({ level: "error", message: "Start Error" + error })
        res.json({ success: false, error: error });
    }

})
router.post('/end', async (req, res) => {
    try {
        let { ride_no } = req.body;
        let ride = await Ride.findOne({ ride_no: ride_no });
        if (!ride) throw new Error(`No such ride`);
        ride.status = 'end';
        await ride.save();
        let bookings = await Booking.find({ ride_id: ride.id, is_cancelled: false });
        bookings.forEach(async (booking) => {
            booking.is_paid = true;
            booking.status = 'end';
            await booking.save();
            let des = await sendToUser(eventType.ride_end, JSON.parse(JSON.stringify(booking)));
        });
        logger.log({ level: "error", message: "End Ride" + ride })
        res.json({ success: true, bookings });
    } catch (error) {
        logger.log({ level: "error", message: "End Error" + error })
        res.json({ success: false, error: error });
    }

})
router.post('/publishrides', async (_req, res) => {
    try {
        await addRides();
        res.json({ success: true, message: "Rides Published" });
    } catch (error) {
        logger.log({ level: "info", message: "Rides Published" + error })
        res.json({ success: false, error: error });
    }

})

module.exports = router;