import mongoose, { Schema } from 'mongoose';
import { BookingStatus } from '../utils/constants';

export interface IBillDetails {
  itemTotal: number;
  discountItemTotal: number;
  promoDiscount: number;
  tax: number;
  grandTotal: number;
}
export interface IBooking {
  id: string;
  ride: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  channel: string;
  seats: number;
  billDetails: IBillDetails;
  promoId: Schema.Types.ObjectId;
  isPaid: Boolean;
  isCancelled: Boolean;
  status: BookingStatus;
}

export interface IBookingFilter {
  id?: string;
  ride?: Schema.Types.ObjectId;
  user?: Schema.Types.ObjectId;
  promoId?: Schema.Types.ObjectId;
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
    ride: {
      type: Schema.Types.ObjectId,
      ref: 'Rides',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    channel: String,
    seats: Number,
    promoId: Schema.Types.ObjectId,
    billDetails: BillDetailsSchema,
    isPaid: Boolean,
    isCancelled: Boolean,
    status: { type: String, enum: BookingStatus },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>('Bookings', BookingSchema, 'bookings');
export default Booking;
