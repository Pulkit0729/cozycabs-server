import { BookingStatus, RideStatus } from './../../../utils/constants';
import { getRide } from '../../../dal/ride.dal';
import { getBooking, searchBooking } from '../../../dal/booking.dal';
import logger from '../../../logger/logger';
import Booking from '../../../models/bookings';
import { IRide } from '../../../models/rides';
import { sendNotification } from '../../../services/external/firebase';
import {
  passengerAddedNotification,
  passengerCancelledNotification,
} from '../../../utils/notifications';
import { Request, Response } from 'express';
import { UserPromoService } from '../../../services/userpromo.service';
import { getFormattedDate } from '../../../utils/date.util';

export class BookingControlller {
  static async book(req: Request, res: Response) {
    try {
      const { user, rideId, userPromoId } = req.body;
      let { seats } = req.body;
      const ride = await BookingControlller.validateRide(rideId, true);

      const existingBooking = await searchBooking({
        rideId: ride.rideId,
        userId: user.userId,
        isCancelled: false,
      });
      if (existingBooking) throw new Error(`Booking already exists`);

      seats = Number.parseInt(seats);
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
        channel: 'app',
        isCancelled: false,
        status: BookingStatus.pending,
      });
      if (userPromoId != undefined && userPromoId.length != 0) {
        await UserPromoService.handlePromoApplication(
          user,
          userPromoId,
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
      return res.json({ success: true, booking });
    } catch (error: any) {
      logger.error(
        `Book error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
      );
      return res.send({ success: false, msg: 'Failed to Book' });
    }
  }

  static async cancel(req: Request, res: Response) {
    try {
      const { user, bookingId } = req.body;
      const booking = await BookingControlller.validateBooking(
        bookingId,
        user.userId
      );
      const ride = await BookingControlller.validateRide(booking.ride.rideId);

      ride.seats = ride.seats + booking.seats;
      booking.isCancelled = true;

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
      return res.json({ success: true, data: booking });
    } catch (error: any) {
      logger.error(
        `Cancel error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
      );
      return res.send({ success: false, msg: 'Failed to Cancel' });
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
