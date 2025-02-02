import { Request, Response } from 'express';
import { BookingService } from '../../../services/booking.service';
import { BookingChannel } from '../../../utils/constants';
import { getBooking } from '../../../dal/booking.dal';
import {
  sendMessage,
  SendPulseEventTypes,
} from '../../../services/external/sendpulse';
import Admin from '../../../models/admin';
import { getPoint } from '../../../dal/point.dal';

export class BookingControlller {
  static async book(req: Request, res: Response) {
    const { user, rideId, userPromoId, seats, pickupId, dropId, pickup, drop } =
      req.body;
    const pickup1 = await getPoint(pickupId);
    const drop1 = await getPoint(dropId);
    const response = await BookingService.book(
      user,
      rideId,
      seats,
      BookingChannel.app,
      userPromoId,
      pickup ?? pickup1,
      drop ?? drop1
    );
    if (response.success && response.booking) {
      const booking = await getBooking(response.booking?.bookingId.toString());
      if (booking) {
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
    return res.json(response);
  }

  static async cancel(req: Request, res: Response) {
    const { user, bookingId } = req.body;
    const response = await BookingService.cancel(user, bookingId);
    if (response.success && response.data) {
      const booking = await getBooking(response.data?.bookingId.toString());
      if (booking) {
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
    return res.json(response);
  }
}
