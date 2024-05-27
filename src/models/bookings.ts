import mongoose, { Types } from 'mongoose';

export interface IBooking {
    id: String,
    ride: Types.ObjectId,
    user: Types.ObjectId,
    channel: String,
    seats: number,
    total: number,
    discounted_total: number,
    is_paid: Boolean,
    is_cancelled: Boolean,
    status: String,
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
    discounted_total: Number,
    is_paid: Boolean,
    is_cancelled: Boolean,
    status: String,
});

const Booking = mongoose.model('Bookings', BookingSchema, 'bookings');
export default Booking;