import { Request, Response } from 'express';
import { addRides } from '../../../rideCron';
import logger from '../../../logger/logger';
import { BookingService } from '../../../services/booking.service';
import { getBooking } from '../../../dal/booking.dal';
import { getUser, getUserFromPhone } from '../../../dal/user.dal';
import { BookingChannel } from '../../../utils/constants';
import {
  sendMessage,
  SendPulseEventTypes,
} from '../../../services/external/sendpulse';
import Admin from '../../../models/admin';
import User from '../../../models/users';

export default class AdminController {
  static async book(req: Request, res: Response) {
    const { rideId, seats, userName, pickupId, dropId } = req.body;
    let { userPhone } = req.body;
    try {
      userPhone = userPhone.replace(/ /g, '');
      userPhone = '91' + userPhone.substr(userPhone.length - 10);
      let user = await getUserFromPhone(userPhone);
      if (!user) {
        user = new User({ phone: userPhone, name: userName ?? 'Unknown' });
        await user.save();
      }
      const response = await BookingService.book(
        user,
        rideId,
        seats,
        BookingChannel.admin,
        undefined,
        pickupId,
        dropId
      );
      if (response.success && response.booking) {
        const booking = await getBooking(
          response.booking?.bookingId.toString()
        );
        if (booking) {
          await sendMessage(
            SendPulseEventTypes.BOOK,
            'user',
            user,
            booking?.ride.driver,
            undefined,
            booking,
            booking?.ride
          );
          const admins = await Admin.find();
          for (const admin of admins) {
            await sendMessage(
              SendPulseEventTypes.BOOK,
              'admin',
              user,
              booking?.ride.driver,
              admin,
              booking,
              booking?.ride
            );
          }
        }
      }
      res.send({ success: true, data: { response } });
    } catch (error: any) {
      logger.log({ level: 'error', message: 'Booking Cancel' + error });
      res.json({ success: false, error: error });
    }
  }
  static async cancel(req: Request, res: Response) {
    const { bookingId } = req.body;
    try {
      const booking = await getBooking(bookingId);
      if (!booking) throw new Error('Booking Id not valid');
      const user = await getUser(booking.userId.toString());
      if (!user) throw new Error('User not found');
      const response = await BookingService.cancel(user, bookingId);
      if (response.success && response.data) {
        const booking = await getBooking(response.data?.bookingId.toString());
        if (booking) {
          await sendMessage(
            SendPulseEventTypes.CANCEL,
            'user',
            user,
            booking?.ride.driver,
            undefined,
            booking,
            booking?.ride
          );
          const admins = await Admin.find();
          for (const admin of admins) {
            await sendMessage(
              SendPulseEventTypes.CANCEL,
              'admin',
              user,
              booking?.ride.driver,
              admin,
              booking,
              booking?.ride
            );
          }
        }
      }
      res.send({ success: true, data: { booking } });
    } catch (error: any) {
      logger.log({ level: 'error', message: 'Booking Cancel' + error });
      res.json({ success: false, error: error });
    }
  }

  static async publish(_req: Request, res: Response) {
    try {
      await addRides();
      res.json({ success: true, message: 'Rides Published' });
    } catch (error) {
      logger.log({ level: 'error', message: 'Rides Published' + error });
      res.json({ success: false, error: error });
    }
  }
}
