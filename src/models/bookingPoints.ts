import mongoose from 'mongoose';

export interface IBookingPoint extends Document {
  bookingPointId: string;
  bookingId: string;
  dropId: string;
  pickupId: string;
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
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

BookingPointSchema.virtual('drop', {
  ref: 'Points',
  localField: 'dropId',
  foreignField: 'pointId',
  justOne: true,
});

BookingPointSchema.virtual('pickup', {
  ref: 'Points',
  localField: 'pickupId',
  foreignField: 'pointId',
  justOne: true,
});

const BookingPoint = mongoose.model<IBookingPoint>(
  'BookingPoints',
  BookingPointSchema,
  'bookingPoints'
);
export default BookingPoint;
