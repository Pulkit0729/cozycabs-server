import { Request, Response } from 'express';
import { BookingService } from '../../../services/booking.service';
import { BookingChannel } from '../../../utils/constants';
import { getBooking, getBookingsFromRide } from '../../../dal/booking.dal';
import {
  sendMessage,
  SendPulseEventTypes,
} from '../../../services/external/sendpulse';
import Admin from '../../../models/admin';
import { verifybydriver } from '../../../utils/verify';

export class BookingControlller {
  static async book(req: Request, res: Response) {
    const { user, rideId, userPromoId, seats, pickupId, dropId } = req.body;
    const response = await BookingService.book(
      user,
      rideId,
      seats,
      BookingChannel.app,
      userPromoId,
      pickupId,
      dropId
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
  static async verify(req: Request, res: Response) {
    const { rideId, otp } = req.body;
    const booking = await getBookingsFromRide(rideId);
    if (!rideId || !otp || !booking) {
      return res
        .status(400)
        .json({ success: false, message: 'Booking ID and OTP are required' });
    }

    try {
      const result = await verifybydriver(rideId, otp);

      if (result.success) {
        return res.json({
          success: true,
          message: 'OTP verification successful',
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message || 'Invalid OTP' });
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error.message);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }
}
