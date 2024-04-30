import { Router } from 'express';
import User from '../../models/users';
import Ride from '../../models/rides';
import Booking from '../../models/bookings';
import logger from '../../logger/logger';
import { eventType, sendToDriver, sendToUser } from '../../services/sendpulse';
import Driver from '../../models/drivers';

const router = Router();
router.post('/book', async (req, res) => {
    try {
        let {
            subject, user_name, user_phone, ride_no, blabla_ride_id, seats
        } = req.body;
        if (subject != null && subject != undefined && !String(subject).toLowerCase().includes('accept') && !String(subject).toLowerCase().includes('new passenger for')) return res.send({ success: false, subject })
        user_phone = user_phone.replace(/ /g, '')
        user_phone = '91' + user_phone.substr(user_phone.length - 10)
        let user = await User.findOneAndUpdate(
            { phone: user_phone },
            { name: user_name, phone: user_phone },
            { upsert: true, new: true }
        );

        // Update ride with seats booked
        let ride;
        if (ride_no) {
            ride = await Ride.findOne(
                { ride_no: Number(ride_no) }
            );
        } else if (blabla_ride_id) {
            ride = await Ride.findOne(
                { blabla_ride_id: blabla_ride_id }
            );
        }
        if (!ride) throw new Error("No ride found");
        let driver = await Driver.findOne({ phone: ride.driver_no });

        seats = Number.parseInt(seats);
        let total = seats * ride.price!;
        ride.seats = ride.seats! - seats;
        await ride.save()
        const booking = new Booking({
            ride_id: ride.id,
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
        await sendToUser(eventType.book, JSON.parse(JSON.stringify(booking)), driver!.toJSON());
        await sendToDriver(eventType.book, JSON.parse(JSON.stringify(booking)), ride.driver_name);

        return res.json({ success: true, booking });
    } catch (error: any) {
        logger.log({ level: "info", message: "Booking Error" + error })
        return res.json({ success: false, error: error });
    }

});
router.post('/cancel', async (req, res) => {
    try {
        let {
            subject, user_name, ride_id, blabla_ride_id, user_phone
        } = req.body;
        if (subject != null && subject != undefined && !String(subject).toLowerCase().includes('cancel')) return res.send({ success: false, subject })

        // Update ride with seats booked
        let ride;
        if (ride_id) {
            ride = await Ride.findById(ride_id);
        } else if (blabla_ride_id) {
            ride = await Ride.findOne(
                { blabla_ride_id: blabla_ride_id }
            );
        }
        if (!ride) throw new Error("No ride found");
        let booking;
        if (user_phone) {
            user_phone = user_phone.replace(/ /g, '')
            user_phone = '91' + user_phone.substr(user_phone.length - 10)
            booking = await Booking.findOne({
                $and: [{ ride_id: ride.id }, { user_no: user_phone }, { is_cancelled: false }]
            });
        }
        if (!booking) {
            let regex = new RegExp('^' + user_name, 'i');
            booking = await Booking.findOne({
                $and: [{ ride_id: ride.id }, { user_name: { $regex: regex } }, { is_cancelled: false }]
            });
        }
        if (!booking) throw new Error("No Booking found");
        booking.is_cancelled = true;
        ride.seats = ride.seats! + booking.seats!;
        await booking.save();
        await ride.save();
        await sendToUser(eventType.cancel, JSON.parse(JSON.stringify(booking)));
        await sendToDriver(eventType.cancel, JSON.parse(JSON.stringify(booking)), ride.driver_name);
        return res.json({ success: true, ride });
    } catch (error: any) {
        logger.log({ level: "info", message: "Cancel Error" + error })
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
        res.json({ success: true, bookings });
    } catch (error) {
        logger.log({ level: "info", message: "Start Error" + error })
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
        })
        res.json({ success: true, bookings });
    } catch (error) {
        logger.log({ level: "info", message: "Start Error" + error })
        res.json({ success: false, error: error });
    }

})
module.exports = router;