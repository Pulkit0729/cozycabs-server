import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    ride_id: String,
    from: String,
    to: String,
    date: String,
    time: String,
    driver_no: String,
    user_no: String,
    user_name: String,
    seats: Number,
    total: Number,
    is_paid: Boolean,
    is_cancelled: Boolean,
    status: String,
});

const Booking= mongoose.model('Bookings', BookingSchema, 'bookings');
export default Booking;