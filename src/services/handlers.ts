import { eventType, sendToDriver, sendToUser } from './sendpulse';
import User from '../models/users';
import Driver from '../models/drivers';
import Ride from '../models/rides';
import Booking from '../models/bookings';
import logger from '../logger/logger';
export async function book(user_phone: string, user_name: string, seats: any, ride_no?: string, blabla_ride_id?: string) {

    try {
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
        return booking;
    } catch (error) {
        logger.log({
            level: 'error',
            message: "Error in booking:" + error
        })
    };
    return;
}


export async function cancel(user_phone?: string, ride_id?: string, user_name?: string, blabla_ride_id?: string) {
    try {
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
        return ride;
    } catch (error) {
        logger.log({
            level: 'error',
            message: "Error in cancelling:" + error
        })
        return;
    }
}