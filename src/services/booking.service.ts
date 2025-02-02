import { searchBlabla } from '../dal/blabla.dal';
import { searchBooking, getBooking } from '../dal/booking.dal';
import { getRide } from '../dal/ride.dal';
import logger from '../logger/logger';
import BookingPoint from '../models/bookingPoints';
import Booking, { IBooking } from '../models/bookings';
import { IPoint } from '../models/points';
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
    userPromoId: string | any[] | undefined = undefined,
    pickup: IPoint | null | undefined = undefined,
    drop: IPoint | null | undefined = undefined
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
      let discountedTotal = seats * ride.discountedPrice;

      if (channel == BookingChannel.blabla) {
        discountedTotal = await this.getBlablatotal(rideId, seats);
      }

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

      await this.handlePickAndDropCharges(pickup, drop, booking, ride);

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
      return { success: false, msg: `Failed to Book ${error.message}` };
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
      booking.markModified('isCancelled');
      booking.markModified('status');
      ride.markModified('seats');
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

  static async getBlablatotal(rideId: string, seats: number) {
    const blabla = await searchBlabla({ rideId: rideId });
    return blabla[0].price * seats;
  }

  static async handlePickAndDropCharges(
    pickup: IPoint | null | undefined,
    drop: IPoint | null | undefined,
    booking: IBooking,
    ride: IRide
  ) {
    const bookingPoint = new BookingPoint({
      bookingId: booking.bookingId,
    });
    if (pickup != undefined) {
      if (pickup.templateRideId === ride.templateRideId) {
        booking.billDetails.itemTotal += pickup.extraCost;
        booking.billDetails.discountItemTotal += pickup.extraCost;
        booking.billDetails.grandTotal += pickup.extraCost;
        bookingPoint.pickup = pickup;
      }
    }
    if (drop != undefined) {
      if (drop.templateRideId === ride.templateRideId) {
        booking.billDetails.itemTotal += drop.extraCost;
        booking.billDetails.discountItemTotal += drop.extraCost;
        booking.billDetails.grandTotal += drop.extraCost;
        bookingPoint.drop = drop;
      }
    }
    if (bookingPoint.pickup || bookingPoint.drop) {
      await bookingPoint.save();
    }
    return booking;
  }
}
