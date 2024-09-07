import mongoose, { Schema, Types } from 'mongoose';
import { ILocation } from './templatedRides';
import { IDriver } from './drivers';

export interface IRide extends Document {
  rideId: Types.ObjectId;
  templateRideId?: string;
  from: string;
  fromLocation: ILocation;
  to: string;
  toLocation: ILocation;
  fromAddress: string;
  toAddress: string;
  date: Date;
  time: string;
  arrivalTime: string;
  departureTime: string;
  driverId: Types.ObjectId;
  driver: IDriver;
  seats: number;
  price: number;
  discountedPrice: number;
  locationUrl: string | undefined;
  status: string;
  navigationStatus: string;
}

const RideSchema = new mongoose.Schema<IRide>(
  {
    rideId: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
      unique: true,
    },
    templateRideId: String,
    from: String,
    to: String,
    fromLocation: Object,
    toLocation: Object,
    fromAddress: String,
    toAddress: String,
    date: Date,
    time: String,
    arrivalTime: String,
    departureTime: String,
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    seats: Number,
    price: Number,
    discountedPrice: Number,
    status: String,
    locationUrl: String,
    navigationStatus: String,
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

RideSchema.virtual('driver', {
  ref: 'Drivers',
  localField: 'driverId',
  foreignField: 'driverId',
  justOne: true,
});

const Ride = mongoose.model('Rides', RideSchema, 'rides');
export default Ride;
