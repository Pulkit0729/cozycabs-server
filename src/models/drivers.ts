import mongoose from 'mongoose';
import { ILocation } from './templatedRides';

export interface IDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  carName: string;
  carNo: string;
  phoneConfirmed: Boolean;
  emailConfirmed: Boolean;
  phoneVerificationId: number;
  fcm: {
    value: string;
    timestamp: Date;
  };
  currentLocation: ILocation;
}
const DriverSchema = new mongoose.Schema<IDriver>(
  {
    name: String,
    email: String,
    phone: String,
    carName: String,
    carNo: String,
    emailConfirmed: Boolean,
    phoneConfirmed: Boolean,
    phoneVerificationId: Number,
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
