import Booking, { IBooking, IBookingFilter } from "../models/bookings";
import { IDriver } from "../models/drivers";
import { IRide } from "../models/rides";
import { IUser } from "../models/users";
import { RideStatus } from "../utils/constants";

export async function getBooking(id: string) {
  return await Booking.findOne({ _id: id }).populate<{ride: any}>({path: 'ride', populate: 'driver'}).then((booking) => {
    return booking;
  });
}
export async function getBookingsFromRide(rideId: string, cancelled: boolean = false) {
  return await Booking.find({ ride: rideId, isCancelled: cancelled }).populate<{ ride: IRide }>('ride').populate<{ user: IUser }>('user').exec();
}

export async function searchBooking(filters: IBookingFilter) {
  return await Booking.findOne(filters).populate<{ ride: IRide }>('ride').populate<{ user: IUser }>('user').then((booking) => {
    return booking;
  });
}

export async function getBookings(filters: any) {
  return await Booking.find(filters).populate<{ ride: IRide }>('ride').populate<{ user: IUser }>('user').then((booking) => {
    return booking;
  });
}

export async function cancelBookings(rideId: string) {
  return await Booking.updateMany({ ride: rideId }, { isCancelled: true });
}
export async function updateBookings(rideId: string, status: RideStatus) {
  return await Booking.updateMany({ ride: rideId }, { status: status });
}