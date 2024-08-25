import { FilterQuery } from 'mongoose';
import Booking, { IBooking } from '../models/bookings';
import { IRide } from '../models/rides';
import { IUser } from '../models/users';
import { RideStatus } from '../utils/constants';

export async function getBooking(bookingId: string) {
  return await Booking.findOne({ bookingId: bookingId })
    .populate<{ ride: IRide }>({ path: 'ride', populate: 'driver' })
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

export async function searchBooking(filters: FilterQuery<IBooking>) {
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

export async function searchBookingsFromRideFilters(
  match: FilterQuery<any>,
  perPage: number = 10,
  page: number = 1
): Promise<IBooking[]> {
  return await Booking.aggregate([
    {
      $lookup: {
        from: 'rides',
        localField: 'rideId',
        foreignField: 'rideId',
        as: 'ride',
      },
    },
    { $unwind: '$ride' },
    {
      $lookup: {
        from: 'drivers', // The drivers collection
        localField: 'ride.driverId', // The driverId field in rides that connects to drivers
        foreignField: 'driverId', // The field in drivers that is the driver id
        as: 'ride.driver', // The name for the resulting array of driver details
      },
    },
    {
      $unwind: '$ride.driver', // Unwind the driver array to get driver details
    },
    {
      $match: match,
    },
    {
      $sort: {
        'ride.date': -1, // Sort by ride date in ascending order (1 for ascending, -1 for descending)
      },
    },
    {
      $skip: (page - 1) * perPage, // Skip the first 10 results (adjust this for your page number)
    },
    {
      $limit: perPage, // Limit the results to 10 documents (page size)
    },
  ]);
}
