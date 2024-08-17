import mongoose, { Schema, Types } from 'mongoose';
import { BookingStatus } from '../utils/constants';
import { IUser } from './users';

export interface IBillDetails {
  itemTotal: number;
  discountItemTotal: number;
  promoDiscount: number;
  tax: number;
  grandTotal: number;
}
export interface IBooking extends Document {
  bookingId: Types.ObjectId;
  rideId: Types.ObjectId;
  userId: Types.ObjectId;
  user: IUser;
  channel: string;
  seats: number;
  billDetails: IBillDetails;
  promoId: Types.ObjectId;
  isPaid: Boolean;
  isCancelled: Boolean;
  status: BookingStatus;
}

export interface IBookingFilter {
  bookingId?: string;
  rideId?: Types.ObjectId;
  userId?: Types.ObjectId;
  promoId?: Types.ObjectId;
  channel?: string;
  seats?: number;
  isPaid?: Boolean;
  isCancelled?: Boolean;
  status?: BookingStatus;
}
export const BillDetailsSchema = new mongoose.Schema<IBillDetails>(
  {
    itemTotal: Number,
    discountItemTotal: Number,
    promoDiscount: Number,
    tax: Number,
    grandTotal: Number,
  },
  { timestamps: true }
);

const BookingSchema = new mongoose.Schema<IBooking>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
      unique: true,
    },
    rideId: {
      type: Schema.Types.ObjectId,
      // ref: 'Rides',
    },
    userId: {
      type: Schema.Types.ObjectId,
      // ref: 'Users',
    },
    channel: String,
    seats: Number,
    promoId: Schema.Types.ObjectId,
    billDetails: BillDetailsSchema,
    isPaid: Boolean,
    isCancelled: Boolean,
    status: { type: String, enum: BookingStatus },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

BookingSchema.virtual('ride', {
  ref: 'Rides',
  localField: 'rideId',
  foreignField: 'rideId',
  justOne: true,
});

BookingSchema.virtual('user', {
  ref: 'Users',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true,
});

const Booking = mongoose.model<IBooking>('Bookings', BookingSchema, 'bookings');
export default Booking;
