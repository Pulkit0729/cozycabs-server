import mongoose, { Schema, Types } from 'mongoose';
import { IDriver } from './drivers';

export interface ILocation {
  type: string;
  coordinates: any[];
}
export interface ITemplateRide extends Document {
  templateRideId: Types.ObjectId;
  from: string;
  fromLocation: ILocation;
  to: string;
  toLocation: ILocation;
  fromAddress: string;
  toAddress: string;
  time: string;
  arrivalTime: string;
  departureTime: string;
  driverId: string;
  driver: IDriver;
  seats: number;
  price: number;
  discountedPrice: number;
}

const TemplatedRideSchema = new mongoose.Schema(
  {
    templateRideId: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
      unique: true,
    },
    from: String,
    to: String,
    fromAddress: String,
    toAddress: String,
    time: String,
    arrivalTime: String,
    departureTime: String,
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    fromLocation: Object,
    toLocation: Object,
    seats: Number,
    price: Number,
    discountedPrice: Number,
  },
  { timestamps: true }
);

TemplatedRideSchema.virtual('driver', {
  ref: 'Drivers',
  localField: 'driverId',
  justOne: true,

  foreignField: 'driverId',
});

const TemplatedRide = mongoose.model(
  'TemplatedRides',
  TemplatedRideSchema,
  'templatedRides'
);
export default TemplatedRide;
