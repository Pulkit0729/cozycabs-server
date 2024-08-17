import Booking, { IBookingFilter } from '../models/bookings';
import { IRide } from '../models/rides';
import { IUser } from '../models/users';
import { RideStatus } from '../utils/constants';

export async function getBooking(bookingId: string) {
  return await Booking.findOne({ bookingId: bookingId })
    .populate<{ ride: any }>({ path: 'ride', populate: 'driver' })
    .then((booking) => {
      return booking;
    });
}
export async function getBookingsFromRide(
  rideId: string,
  cancelled: boolean = false
) {
  return await Booking.find({ rideId: rideId, isCancelled: cancelled })
    .populate<{ ride: IRide }>('ride')
    .populate<{ user: IUser }>('user')
    .exec();
}

export async function searchBooking(filters: IBookingFilter) {
  return await Booking.findOne(filters)
    .populate<{ ride: IRide }>('ride')
    .populate<{ user: IUser }>('user')
    .then((booking) => {
      return booking;
    });
}

export async function getBookings(filters: any) {
  return await Booking.find(filters)
    .populate<{ ride: IRide }>('ride')
    .populate<{ user: IUser }>('user')
    .then((booking) => {
      return booking;
    });
}

export async function cancelBookings(rideId: string) {
  return await Booking.updateMany({ rideId: rideId }, { isCancelled: true });
}
export async function updateBookings(rideId: string, status: RideStatus) {
  return await Booking.updateMany({ rideId: rideId }, { status: status });
}
