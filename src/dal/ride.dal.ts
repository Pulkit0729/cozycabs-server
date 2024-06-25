import { ObjectId } from "mongoose";
import { IDriver } from "../models/drivers";
import Ride from "../models/rides";
import { RideStatus } from "../utils/constants";

export async function getRide(id: ObjectId | string) {
  return await Ride.findOne({ _id: id }).populate<{ driver: IDriver }>('driver').then((ride) => {
    return ride;
  });
}

export async function cancelRide(id: ObjectId | string) {
  await Ride.updateOne({ _id: id }, { status: RideStatus.cancelled });
  return getRide(id);
}


