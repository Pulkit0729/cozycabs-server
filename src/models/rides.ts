import mongoose, { Schema } from 'mongoose';
import { ILocation } from './templatedRides';

export interface IRide {
  id: string;
  blabla_ride_id: string;
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
  driver: Schema.Types.ObjectId;
  seats: number;
  price: number;
  discountedPrice: number;
  rideNo: number;
  locationUrl: string | undefined;
  status: string;
  navigationStatus: string;
}

const RideSchema = new mongoose.Schema<IRide>(
  {
    blabla_ride_id: String,
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
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drivers',
    },
    seats: Number,
    price: Number,
    discountedPrice: Number,
    rideNo: {
      type: Number,
      unique: true,
    },
    status: String,
    locationUrl: String,
    navigationStatus: String,
  },
  { timestamps: true }
);

const Ride = mongoose.model('Rides', RideSchema, 'rides');
export default Ride;
