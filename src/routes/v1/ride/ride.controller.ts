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
import {
  sendMessage,
  SendPulseEventTypes,
} from '../../../services/external/sendpulse';
import { getUniqueFromToPlaces } from '../../../dal/templateRide.dal';

export class RideController {
  static async updateRideStatus(req: Request, res: Response) {
    const { driver, rideId, status } = req.body;
    try {
      const ride = await getRide(rideId);
      if (!ride) throw new Error('Ride not found');
      if (driver.driverId.toString() != ride.driver.driverId.toString())
        throw new Error('Unauthenticated driver');
      ride.status = status;
      const bookings = await getBookingsFromRide(ride.rideId.toString());
      bookings.forEach(async (booking) => {
        switch (ride.status) {
          case RideStatus.cancelled:
            booking.isCancelled = true;
            booking.status = BookingStatus.cancelled;
            if (booking.promoId)
              await updateUserPromo(booking.promoId.toString(), {
                isUsed: false,
              });
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
      const sendPulseEventType =
        ride.status == RideStatus.active
          ? SendPulseEventTypes.RIDESTART
          : ride.status == RideStatus.cancelled
            ? SendPulseEventTypes.RIDECANCEL
            : SendPulseEventTypes.RIDEEND;

      for (const booking of bookings) {
        const userFcm = booking.user.fcm?.value;
        if (userFcm) {
          const message = createRideStatusNotification(
            userFcm.toString(),
            ride as unknown as IRide
          );
          await sendNotification(message);
        }

        await sendMessage(
          sendPulseEventType,
          'user',
          booking.user,
          ride.driver,
          undefined,
          booking,
          booking.ride
        );
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

  static async getMetadata(_req: Request, res: Response) {
    const { from, to } = await getUniqueFromToPlaces();
    return res
      .status(200)
      .json({ success: true, data: { from: from, to: to } });
  }
}
