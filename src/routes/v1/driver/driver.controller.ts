import { Request, Response } from 'express';
import { getBookingsFromRide } from '../../../dal/booking.dal';
import { getRide } from '../../../dal/ride.dal';
import logger from '../../../logger/logger';
import { IDriver } from '../../../models/drivers';
import { IRide } from '../../../models/rides';
import { sendNotification } from '../../../services/external/firebase';
import {
  createRideNavStatusNotification,
  createRideStatusNotification,
} from '../../../utils/notifications';
import { Document, MergeType, Types } from 'mongoose';
import { NavigationStatus } from '../../../utils/constants';
import { RideService } from '../../../services/ride.service';

export class DriverController {
  static async rideStatus(req: Request, res: Response) {
    const {
      driver,
      rideId,
      navstatus,
    }: { driver: IDriver; rideId: string; navstatus: NavigationStatus } =
      req.body;
    try {
      const ride = await getRide(rideId);
      if (!ride) throw new Error('Ride not found');
      if (driver.driverId.toString() != ride.driver.driverId.toString())
        throw new Error('Unauthenticated driver');

      ride.navigationStatus = navstatus;
      ride.markModified('navigationStatus');
      await ride.save();
      await RideService.handleRideTimeline(ride.rideId.toString(), navstatus);
      await DriverController.sendStatusUpdateNotification(ride, navstatus);
      return res.status(200).json({
        success: true,
        message: 'Ride Navigation Status Updated successfully',
      });
    } catch (error: any) {
      logger.error(
        `Ride Status API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
      );
      return res.send({ success: false, msg: 'Unable to update status' });
    }
  }

  static async sendStatusUpdateNotification(
    ride: Document<
      unknown,
      {},
      MergeType<
        IRide,
        {
          driver: IDriver;
        }
      >
    > &
      Omit<IRide, 'driver'> & {
        driver: IDriver;
      } & {
        _id: Types.ObjectId;
      },
    navstatus: string
  ) {
    const bookings = await getBookingsFromRide(ride.rideId.toString());
    for (const booking of bookings) {
      const userFcm = booking.user.fcm?.value;
      if (userFcm) {
        const message = createRideNavStatusNotification(
          userFcm.toString(),
          ride as unknown as IRide,
          navstatus
        );
        if (message) await sendNotification(message);
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
  }
}
