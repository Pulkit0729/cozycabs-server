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
import { getPoint } from '../../../dal/point.dal';
import { RideService } from '../../../services/ride.service';
import { getBlockedUserFromUser } from '../../../dal/blockedUser.dal';
import BlockedUser from '../../../models/blockedUser';

export default class AdminController {
  static async book(req: Request, res: Response) {
    const { rideId, seats, userName, pickupId, dropId, pickup, drop } =
      req.body;
    let { userPhone } = req.body;
    try {
      userPhone = userPhone.replace(/ /g, '');
      userPhone = '91' + userPhone.substr(userPhone.length - 10);
      let user = await getUserFromPhone(userPhone);
      if (!user) {
        user = new User({ phone: userPhone, name: userName ?? 'Unknown' });
        await user.save();
      }
      const pickup1 = await getPoint(pickupId);
      const drop1 = await getPoint(dropId);
      const response = await BookingService.book(
        user,
        rideId,
        seats,
        BookingChannel.admin,
        undefined,
        pickup ?? pickup1,
        drop ?? drop1
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

  static async cancelRide(req: Request, res: Response) {
    const { rideId, status } = req.body;
    try {
      await RideService.updateRideStatus(rideId, status);

      res.send({ success: true, message: 'Ride Stautus Updated successfully' });
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
  static async blockUser(req: Request, res: Response) {
    const { phone, userId, reason } = req.body;
    try {
      let user;
      if (userId) {
        user = await getUser(userId);
      } else if (phone) {
        const formattedPhone = '91' + phone.trim();
        user = await getUserFromPhone(formattedPhone);
      }
      if (!user) {
        throw Error('User not found');
      }
      const blockedUser = await getBlockedUserFromUser(user.userId.toString());
      if (blockedUser && blockedUser.isBlocked) {
        throw Error('User blocked already');
      } else if (blockedUser && !blockedUser.isBlocked) {
        blockedUser.isBlocked = true;
        blockedUser.reason = reason;
        blockedUser.markModified('isBlocked');
        blockedUser.markModified('reason');
        await blockedUser.save();
      } else {
        const newblockedUser = new BlockedUser({
          userId: user.userId.toString(),
          reason: reason,
          isBlocked: true,
        });
        await newblockedUser.save();
        return res.json({
          success: true,
          data: { blockedUser: newblockedUser },
        });
      }
      return res.json({ success: true, data: { blockedUser } });
    } catch (error: any) {
      logger.error(error.message);
      return res.json({ success: false, message: error.message });
    }
  }
  static async unblockUser(req: Request, res: Response) {
    const { phone, userId } = req.body;

    try {
      let user;
      if (userId) {
        user = await getUser(userId);
      } else if (phone) {
        const formattedPhone = '91' + phone.trim();
        user = await getUserFromPhone(formattedPhone);
      }
      if (!user) {
        throw Error('User not found');
      }
      const blockedUser = await getBlockedUserFromUser(user.userId.toString());
      if (!blockedUser || !blockedUser.isBlocked) {
        throw Error('User not blocked');
      }
      blockedUser.isBlocked = false;
      blockedUser.markModified('isBlocked');
      await blockedUser.save();
      return res.json({ success: true, data: { blockedUser } });
    } catch (error: any) {
      logger.error(error.message);
      return res.json({ success: false, message: error.message });
    }
  }
}
