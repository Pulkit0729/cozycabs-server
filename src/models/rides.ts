import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
    ride_id: String,
    from: String,
    to: String,
    date: String,
    time: String,
    driver_no: String,
    driver_name: String,
    seats: Number,
    price: Number,
    ride_no: Number,
    status: String,
});

const Ride= mongoose.model('Rides', RideSchema, 'rides');
export default Ride;