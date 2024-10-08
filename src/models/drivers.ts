import mongoose, { Schema, Types } from 'mongoose';
import { ILocation } from './templatedRides';

export interface IDriver extends Document {
  driverId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  carName: string;
  carNo: string;
  phoneConfirmed: Boolean;
  emailConfirmed: Boolean;
  phoneVerificationId: number;
  rating?: number;
  fcm: {
    value: string;
    timestamp: Date;
  };
  currentLocation: ILocation;
}
const DriverSchema = new mongoose.Schema<IDriver>(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    phone: String,
    carName: String,
    carNo: String,
    emailConfirmed: Boolean,
    phoneConfirmed: Boolean,
    phoneVerificationId: Number,
    rating: Number,
    fcm: {
      value: String,
      timestamp: Date,
    },
    currentLocation: Object,
  },
  { timestamps: true }
);

const Driver = mongoose.model('Drivers', DriverSchema, 'drivers');
export default Driver;
