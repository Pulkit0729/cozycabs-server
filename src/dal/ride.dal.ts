import { ObjectId } from 'mongoose';
import { IDriver } from '../models/drivers';
import Ride from '../models/rides';
import { RideStatus } from '../utils/constants';

export async function getRide(rideId: ObjectId | string) {
  return await Ride.findOne({ rideId: rideId })
    .populate<{ driver: IDriver }>('driver')
    .then((ride) => {
      return ride;
    });
}

export async function cancelRide(rideId: ObjectId | string) {
  await Ride.updateOne({ rideId: rideId }, { status: RideStatus.cancelled });
  return getRide(rideId);
}
