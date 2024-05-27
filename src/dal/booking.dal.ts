import Booking from "../models/bookings";
import { IRide } from "../models/rides";
import { IUser } from "../models/users";

export async function getBooking(id: string) {
  return await Booking.findOne({ _id: id }).populate<{ driver: IRide }>('ride').populate<{ driver: IUser }>('user').then((booking) => {
    return booking;
  });
}
export async function getBookingsFromRide(rideId: string, cancelled: boolean = false) {
  return await Booking.find({ ride: rideId, is_cancelled: cancelled }).populate<{ driver: IRide }>('ride').populate<{ driver: IUser }>('user');
}

export async function searchBooking(filters: any) {
  return await Booking.findOne(filters).populate<{ driver: IRide }>('ride').populate<{ driver: IUser }>('user').then((booking) => {
    return booking;
  });
}

export async function getBookings(filters: any) {
  return await Booking.find(filters).populate<{ driver: IRide }>('ride').populate<{ driver: IUser }>('user').then((booking) => {
    return booking;
  });
}

