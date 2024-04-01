import { Router } from 'express';
import User from '../../models/users';
import Ride from '../../models/rides';
import Booking from '../../models/bookings';
import logger from '../../logger/logger';

const router = Router();
router.post('/book', async (req, res) => {
    try {
        const {
            user_name, user_phone, blabla_ride_id, seats, total
        } = req.body;
        let user = await User.findOneAndUpdate(
            { phone: user_phone },
            { name: user_name, phone: user_phone },
            { upsert: true, new: true }
        );
        // Update ride with seats booked
        let ride = await Ride.findOneAndUpdate(
            {ride_id: blabla_ride_id},
            { $inc: { seats: -seats } }
        );
        if (!ride) throw new Error("No ride found");
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
        res.json(booking);
    } catch (error: any) {
        logger.log({ level: "info", message:"Booking Error", error })
        res.json({ error: error });
    }

});
router.post('/cancel', async (req, res) => {
    try {
        const {
            user_name, blabla_ride_id
        } = req.body;
        // Update ride with seats booked
        let ride = await Ride.findOne(
            { ride_id: blabla_ride_id }
        );
        if (!ride) throw new Error("No ride found");
        let booking = await Booking.findOneAndUpdate({
            $and: [{ ride_id: blabla_ride_id }, { user_name: user_name }, {is_cancelled: false}]
        },
            { is_cancelled: true }
        );
        if (!booking) throw new Error("No Booking found");
        ride.seats = ride.seats! + booking.seats!;
        await ride.save();
        res.json(ride);
    } catch (error: any) {
        logger.log({ level: "info", message:"Cancel Error", error })
        res.json({ error: error });
    }

});

module.exports = router;