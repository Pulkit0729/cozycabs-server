import { Request, Response } from 'express';
import { getBookingsFromRide } from '../../../dal/booking.dal';
import { getRide } from '../../../dal/ride.dal';
import logger from '../../../logger/logger';
import { IRide } from '../../../models/rides';
import { sendNotification } from '../../../services/external/firebase';
import { BookingStatus, RideStatus } from '../../../utils/constants';
import { createRideStatusNotification } from '../../../utils/notifications';
import { UserPromoService } from '../../../services/userpromo.service';
import { updateUserPromo } from '../../../dal/userPromo.dal';

export class RideController {
  static async updateRideStatus(req: Request, res: Response) {
    const { user, rideId, status } = req.body;
    try {
      const ride = await getRide(rideId);
      if (!ride) throw new Error('Ride not found');
      if (user.id != ride.driver.id) throw new Error('Unauthenticated driver');
      ride.status = status;
      const bookings = await getBookingsFromRide(ride.id);
      bookings.forEach(async (booking) => {
        switch (ride.status) {
          case RideStatus.cancelled:
            booking.isCancelled = true;
            booking.status = BookingStatus.cancelled;
            await updateUserPromo(booking.promoId, { isUsed: false });
            break;
          case RideStatus.ended:
            booking.status = BookingStatus.ended;
            await UserPromoService.handleReferralPromoAfterRide(booking);
            break;
          case RideStatus.active:
            booking.status = BookingStatus.active;
            break;
        }
        await booking.save();
      });
      for (const booking of bookings) {
        const userFcm = booking.user.fcm?.value;
        if (userFcm) {
          const message = createRideStatusNotification(
            userFcm.toString(),
            ride as unknown as IRide
          );
          await sendNotification(message);
        }
      }

      const driverFcm = ride.driver.fcm?.value;
      if (driverFcm) {
        const message = createRideStatusNotification(
          driverFcm.toString(),
          ride as unknown as IRide
        );
        await sendNotification(message);
      }
      ride.markModified('status');
      await ride.save();
      return res
        .status(200)
        .json({ success: true, message: 'Ride Stautus Updated successfully' });
    } catch (error: any) {
      logger.error(
        `Ride Status API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
      );
      return res.send({ success: false, msg: 'Unable to update status' });
    }
  }
}
