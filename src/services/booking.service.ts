import { searchBooking, getBooking } from '../dal/booking.dal';
import { getRide } from '../dal/ride.dal';
import logger from '../logger/logger';
import Booking from '../models/bookings';
import { IRide } from '../models/rides';
import { IUser } from '../models/users';
import { BookingChannel, BookingStatus, RideStatus } from '../utils/constants';
import { getFormattedDate } from '../utils/date.util';
import {
  passengerAddedNotification,
  passengerCancelledNotification,
} from '../utils/notifications';
import { sendNotification } from './external/firebase';
import { UserPromoService } from './userpromo.service';

export class BookingService {
  static async book(
    user: IUser,
    rideId: string,
    seats: string | number,
    channel: BookingChannel,
    userPromoId: string | any[] | undefined = undefined
  ) {
    try {
      const ride = await BookingService.validateRide(rideId, true);

      const existingBooking = await searchBooking({
        rideId: ride.rideId,
        userId: user.userId,
        isCancelled: false,
      });
      if (existingBooking) throw new Error(`Booking already exists`);

      seats = Number.parseInt(seats as string);
      if (ride.seats < seats) {
        throw Error(`Required seats ${seats}, available seats: ${ride.seats}`);
      }
      ride.seats = ride.seats - seats;

      const total = seats * ride.price;
      const discountedTotal = seats * ride.discountedPrice;

      const booking = new Booking({
        rideId: ride.rideId,
        userId: user.userId,
        seats: seats,
        billDetails: {
          itemTotal: total,
          discountItemTotal: discountedTotal,
          promoDiscount: 0,
          tax: 0,
          grandTotal: discountedTotal,
        },
        isPaid: false,
        channel: channel,
        isCancelled: false,
        status: BookingStatus.pending,
      });
      if (userPromoId != undefined && userPromoId.length != 0) {
        await UserPromoService.handlePromoApplication(
          user,
          userPromoId.toString(),
          booking
        );
      }
      await booking.save();
      await ride.save();

      const driverFcm = ride.driver.fcm?.value;
      if (driverFcm) {
        const message = passengerAddedNotification(
          driverFcm.toString(),
          ride as unknown as IRide,
          user
        );
        await sendNotification(message);
      }
      logger.log({ level: 'info', message: 'Booking Complted' + booking });
      return { success: true, booking };
    } catch (error: any) {
      logger.error(`Book error: ${error.message}`);
      return { success: false, msg: 'Failed to Book' };
    }
  }

  static async cancel(user: IUser, bookingId: string) {
    try {
      const booking = await BookingService.validateBooking(
        bookingId,
        user.userId.toString()
      );
      const ride = await BookingService.validateRide(
        booking.ride.rideId.toString()
      );

      ride.seats = ride.seats + booking.seats;
      booking.isCancelled = true;
      booking.status = BookingStatus.cancelled;

      await ride.save();
      await booking.save();

      const driverFcm = ride.driver.fcm?.value;
      if (driverFcm) {
        const message = passengerCancelledNotification(
          driverFcm.toString(),
          ride as unknown as IRide,
          user
        );
        await sendNotification(message);
      }

      logger.log({
        level: 'info',
        message: 'Cancelled Successfully' + booking,
      });
      return { success: true, data: booking };
    } catch (error: any) {
      logger.error(`Cancel error: ${error.message} `);
      return { success: false, msg: 'Failed to Cancel' };
    }
  }

  static async validateRide(rideId: string, validateSeats: boolean = false) {
    const ride = await getRide(rideId);
    if (!ride) throw new Error(`Ride ${rideId} does not exist`);
    if ([RideStatus.cancelled, RideStatus.ended].includes(ride.status as any))
      throw new Error(`Ride ${rideId} is already ended`);
    if (ride.date < getFormattedDate(0))
      throw new Error(`Ride ${rideId} is already ended`);
    if (validateSeats && ride.seats < 1)
      throw new Error(`No seats in ride ${rideId}`);
    return ride;
  }

  static async validateBooking(bookingId: string, userId: string) {
    const booking = await getBooking(bookingId);
    if (!booking) throw new Error(`Booking ${bookingId} not found`);
    if (booking.userId.toString() != userId)
      throw new Error(`Unauthenticated booking cancellation`);
    if (booking.status != BookingStatus.pending || booking.isCancelled)
      throw new Error(`Booking status ${booking.status} not pending`);
    return booking;
  }
}
