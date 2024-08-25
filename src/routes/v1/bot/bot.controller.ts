import { Request, Response } from 'express';
import { findOrCreateUser, getUserFromPhone } from '../../../dal/user.dal';
import logger from '../../../logger/logger';
import { issueJWT } from '../../../utils/jwt.util';
import { BookingService } from '../../../services/booking.service';
import {
  sendMessage,
  SendPulseEventTypes,
} from '../../../services/external/sendpulse';
import {
  getBooking,
  searchBookingsFromRideFilters,
} from '../../../dal/booking.dal';
import Admin from '../../../models/admin';
import { BookingChannel, BookingStatus } from '../../../utils/constants';
import { getFormattedDate } from '../../../utils/date.util';

export default class BotController {
  static async botAccessToken(req: Request, res: Response) {
    try {
      let { userPhone } = req.body;
      userPhone = userPhone.replace(/ /g, '');
      userPhone = '91' + userPhone.substr(userPhone.length - 10);
      const user = await findOrCreateUser({ phone: userPhone });
      const token = issueJWT(user.userId.toString(), 120);
      const payload: any = {
        token,
      };
      return res.status(200).json({ success: true, data: payload });
    } catch (error: any) {
      logger.log({
        level: 'error',
        message: 'Bot Generate Access ErrorF' + error,
      });
      return res.json({ success: false, error: error });
    }
  }

  static async verify(req: Request, res: Response) {
    try {
      const { user } = req.body;
      return res
        .status(200)
        .json({ success: true, data: { auth: true, user } });
    } catch (error: any) {
      logger.log({
        level: 'error',
        message: 'Bot Verify Erro' + error,
      });
      return res.json({
        success: false,
        error: error,
        data: { auth: false },
      });
    }
  }
  static async bookFromBot(req: Request, res: Response) {
    const { user, rideId, seats } = req.body;
    const response = await BookingService.book(
      user,
      rideId,
      seats,
      BookingChannel.bot
    );
    if (response.success && response.booking) {
      const booking = await getBooking(response.booking?.bookingId.toString());
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
    } else {
      await sendMessage(SendPulseEventTypes.ERROR, 'user', user);
    }
    return res.json(response);
  }
  static async cancelFromBot(req: Request, res: Response) {
    const { user, bookingId } = req.body;
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
    return res.json(response);
  }
  static async getUserBookings(req: Request, res: Response) {
    let { userPhone }: { userPhone: string; perPage: number; page: number } =
      req.body;
    const { perPage, page }: { perPage: number; page: number } = req.body;
    try {
      userPhone = userPhone.replace(/ /g, '');
      userPhone = '91' + userPhone.substr(userPhone.length - 10);
      const user = await getUserFromPhone(userPhone);
      if (!user) throw new Error('User not found');
      const bookings = await searchBookingsFromRideFilters(
        {
          userId: user.userId,

          $or: [
            { status: BookingStatus.active },
            { status: BookingStatus.pending },
          ],
          'ride.date': { $gte: getFormattedDate(0) },
        },
        perPage ?? 10,
        page ?? 1
      );
      return res.json({ success: true, data: { bookings } });
    } catch (error: any) {
      return res.json({ success: false, error: error.message });
    }
  }
}
