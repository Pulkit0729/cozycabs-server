import mongoose from 'mongoose';
import { IPoint, PointSchema } from './points';

export interface IBookingPoint extends Document {
  bookingPointId: string;
  bookingId: string;
  dropId: string;
  pickupId: string;
  pickup: IPoint;
  drop: IPoint;
}

export const BookingPointSchema = new mongoose.Schema<IBookingPoint>(
  {
    bookingPointId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      required: true,
      unique: true,
    },
    bookingId: String,
    dropId: String,
    pickupId: String,
    pickup: PointSchema,
    drop: PointSchema,
  },
  { timestamps: true }
);

const BookingPoint = mongoose.model<IBookingPoint>(
  'BookingPoints',
  BookingPointSchema,
  'bookingPoints'
);
export default BookingPoint;
