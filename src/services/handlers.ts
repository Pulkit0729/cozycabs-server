import { eventType, sendError, sendToAdmin, sendToDriver, sendToUser } from './sendpulse';
import User from '../models/users';
import Driver, { IDriver } from '../models/drivers';
import Ride, { IRide } from '../models/rides';
import Booking from '../models/bookings';
import logger from '../logger/logger';
import Admin from '../models/admin';
export async function book(user_phone: string, user_name: string, seats: any, rideNo?: string, blabla_ride_id?: string) {

    try {
        user_phone = user_phone.replace(/ /g, '')
        user_phone = '91' + user_phone.substr(user_phone.length - 10);

        if (user_name == undefined || user_name.length == 0) {
            user_name = user_phone;
        }
        let user = await User.findOneAndUpdate(
            { phone: user_phone },
            { name: user_name, phone: user_phone },
            { upsert: true, new: true }
        );

        // Update ride with seats booked
        let ride;
        if (rideNo) {
            ride = await Ride.findOne(
                { rideNo: Number(rideNo) }
            ).populate<{ driver: IDriver }>('driver');;
        } else if (blabla_ride_id) {
            ride = await Ride.findOne(
                { blabla_ride_id: blabla_ride_id }
            ).populate<{ driver: IDriver }>('driver');;
        }
        if (!ride) throw new Error("No ride found");
        let existingBooking = await Booking.findOne({ ride_id: ride.id, user_no: user_phone, isCancelled: false });
        if (existingBooking) throw new Error(`Booking already exists`);
        seats = Number.parseInt(seats);
        let total = seats * ride.price!;
        let discountedTotal = blabla_ride_id && blabla_ride_id.length == 36 ? total : seats * ride.discountedPrice!;
        let channel = blabla_ride_id && blabla_ride_id.length == 36 ? "blabla" : "bot";
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
            discountedTotal: discountedTotal,
            isPaid: false,
            isCancelled: false,
            channel: channel,
            status: "pending",
        });
        await booking.save();
        await sendToUser(eventType.book, booking, ride as unknown as IRide, user, ride.driver);
        await sendToDriver(eventType.book, booking, ride as unknown as IRide, user, ride.driver);
        let admins = await Admin.find();
        for (let admin of admins) {
            await sendToAdmin(eventType.book, booking, ride as unknown as IRide, user, admin.phone);
        }
        return booking;
    } catch (error) {
        logger.log({
            level: 'error',
            message: "Error in booking:" + error
        });
        user_phone = user_phone.replace(/ /g, '')
        user_phone = '91' + user_phone.substr(user_phone.length - 10);

        if (user_name == undefined || user_name.length == 0) {
            user_name = user_phone;
        }
        await sendError(eventType.error, user_phone);
    };
    return;
}


export async function cancel(user_phone?: string, ride_id?: string, user_name?: string, blabla_ride_id?: string) {
    try {
        let ride;
        if (ride_id) {
            ride = await Ride.findById(ride_id).populate<{ driver: IDriver }>('driver');;
        } else if (blabla_ride_id) {
            ride = await Ride.findOne(
                { blabla_ride_id: blabla_ride_id }
            ).populate<{ driver: IDriver }>('driver');;
        }
        if (!ride) throw new Error("No ride found");

        let user;
        if (user_phone) {
            user_phone = user_phone.replace(/ /g, '')
            user_phone = '91' + user_phone.substr(user_phone.length - 10);
            user = await User.findOne({ phone: user_phone });
        }
        if (!user) {
            let regex = new RegExp('^' + user_name, 'i');
            user = await User.findOne({ user_name: { $regex: regex } });
        }
        if (!user) throw new Error("No user found");
        let booking = await Booking.findOne({
            $and: [{ user: user.id }, { isCancelled: false }]
        });
        if (!booking) throw new Error("No Booking found");
        booking.isCancelled = true;
        ride.seats = ride.seats! + booking.seats!;
        await booking.save();
        await ride.save();
        await sendToUser(eventType.cancel, booking, ride as unknown as IRide, user, ride.driver);
        await sendToDriver(eventType.cancel, booking, ride as unknown as IRide, user, ride.driver);
        let admins = await Admin.find();
        for (let admin of admins) {
            await sendToAdmin(eventType.cancel, booking, ride as unknown as IRide, user, admin.phone);
        }
        return ride;
    } catch (error) {
        logger.log({
            level: 'error',
            message: "Error in cancelling:" + error
        })
        return;
    }
}