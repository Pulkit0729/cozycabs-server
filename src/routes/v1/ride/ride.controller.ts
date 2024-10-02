import { Request, Response } from 'express';
import { getRide } from '../../../dal/ride.dal';
import logger from '../../../logger/logger';
import { getUniqueFromToPlaces } from '../../../dal/templateRide.dal';
import { RideService } from '../../../services/ride.service';

export class RideController {
  static async updateRideStatus(req: Request, res: Response) {
    const { driver, rideId, status } = req.body;
    try {
      const ride = await getRide(rideId);
      if (!ride) throw new Error('Ride not found');
      if (driver.driverId.toString() != ride.driver.driverId.toString())
        throw new Error('Unauthenticated driver');
      await RideService.updateRideStatus(rideId, status);
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
