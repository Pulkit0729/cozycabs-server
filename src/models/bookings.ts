import mongoose, { Types } from 'mongoose';

export interface IBooking {
    id: String,
    ride: Types.ObjectId,
    user: Types.ObjectId,
    channel: String,
    seats: number,
    total: number,
    discountedTotal: number,
    isPaid: Boolean,
    isCancelled: Boolean,
    status: String,
}

export interface IBookingFilter {
    id?: String,
    ride?: Types.ObjectId,
    user?: Types.ObjectId,
    channel?: String,
    seats?: number,
    total?: number,
    discountedTotal?: number,
    isPaid?: Boolean,
    isCancelled?: Boolean,
    status?: String,
}

const BookingSchema = new mongoose.Schema<IBooking>({
    ride: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Rides'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users'
    },
    channel: String ,
    seats: Number,
    total: Number,
    discountedTotal: Number,
    isPaid: Boolean,
    isCancelled: Boolean,
    status: String,
}, { timestamps: true });

const Booking = mongoose.model('Bookings', BookingSchema, 'bookings');
export default Booking;