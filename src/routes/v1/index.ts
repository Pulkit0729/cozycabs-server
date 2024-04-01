import { Router } from 'express';
import User from '../../models/users';
import Ride from '../../models/rides';
import Booking from '../../models/bookings';
import logger from '../../logger/logger';

const router = Router();
router.post('/book', async (req, res) => {
    try {
        let {
            user_name, user_phone, blabla_ride_id, seats, total
        } = req.body;
        let user = await User.findOneAndUpdate(
            { phone: user_phone },
            { name: user_name, phone: user_phone },
            { upsert: true, new: true }
        );
        seats = Number.parseInt(seats);
        total = Number.parseInt(total);
        // Update ride with seats booked
        let ride = await Ride.findOne(
            {ride_id: blabla_ride_id}
        );
        if (!ride) throw new Error("No ride found");
        ride.seats = ride.seats! - seats;
        await ride.save()
        const booking = new Booking({
            ride_id: blabla_ride_id,
            from: ride.from,
            to: ride.to,
            date: ride.date,
            time: ride.time,
            driver_no: ride.driver_no,
            user_no: user_phone,
            user_name: user_name,
            seats: seats,
            total: total,
            is_paid: false,
            is_cancelled: false,
            status: "pending",
        });
        await booking.save();
        res.json({success: true, booking});
    } catch (error: any) {
        logger.log({ level: "info", message:"Booking Error"+ error })
        res.json({ success: false, error: error });
    }

});
router.post('/cancel', async (req, res) => {
    try {
        let {
            user_name, blabla_ride_id, user_phone
        } = req.body;
        // Update ride with seats booked
        let ride = await Ride.findOne(
            { ride_id: blabla_ride_id }
        );
        if (!ride) throw new Error("No ride found");
        let booking;
        if (user_phone) {
            booking = await Booking.findOne({
                $and: [{ ride_id: blabla_ride_id }, { user_no: user_phone }, { is_cancelled: false }]
            });
            if (!booking) {
                booking = await Booking.findOne({
                    $and: [{ ride_id: blabla_ride_id }, { user_name: user_name }, { is_cancelled: false }]
                });
            }
        }
        if (!booking) throw new Error("No Booking found");
        booking.is_cancelled = true;
        ride.seats = ride.seats! + booking.seats!;
        await booking.save();
        await ride.save();
        res.json({success: true, ride});
    } catch (error: any) {
        logger.log({ level: "info", message:"Cancel Error"+error })
        res.json({success: false,  error: error });
    }

});

module.exports = router;