import { Router } from 'express';
import logger from '../../logger/logger';
import { getUser } from '../../dal/user.dal';
import { getRide } from '../../dal/ride.dal';
import Booking from '../../models/bookings';
import { searchBooking } from '../../dal/booking.dal';
import authMiddle from '../../middlewares/authMiddle';

const router = Router();


router.post('/', authMiddle, async (req, res) => {
    try {
        let {
            user, ride_id, seats
        } = req.body;
        let ride = await getRide(ride_id);
        if (!ride) throw new Error(`Ride ${ride_id} does not exist`);

        let existingBooking = await searchBooking({ ride_id: ride.id, user: user.id, is_cancelled: false });
        if (existingBooking) throw new Error(`Booking already exists`);
        seats = Number.parseInt(seats);
        let total = seats * ride.price!;
        let discounted_total = seats * ride.discounted_price!;
        if (!ride.seats || ride.seats == 0 || ride.seats < seats) {
            throw Error("Please select valid no of seats");
        }
        ride.seats = ride.seats - seats;
        await ride.save()
        const booking = new Booking({
            ride: ride.id,
            user: user.id,
            seats: seats,
            total: total,
            discounted_total: discounted_total,
            is_paid: false,
            is_cancelled: false,
            status: "pending",
        });
        await booking.save(); logger.log({ level: "info", message: "Booking Complted" + booking })
        return res.json({ success: true, booking });
    } catch (error: any) {
        logger.error(`Book error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
        );
        return res.send({ success: false, msg: "Failed to Book" });
    }
})


module.exports = router;