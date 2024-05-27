import { ObjectId } from "mongoose";
import { IDriver } from "../models/drivers";
import Ride from "../models/rides";

export async function getRide(id:  ObjectId | string ) {
  return await Ride.findOne({ _id: id }).populate<{ driver: IDriver }>('driver').then((ride) => {
    return ride;
  });
}

