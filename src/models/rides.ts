import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
    ride_id: {
        type: String,
        unique: true,
    },
    from: String,
    to: String,
    date: String,
    time: String,
    driver_no: String,
    driver_name: String,
    seats: Number,
    price: Number,
    ride_no: {
        type: Number,
        unique: true,
    },
    status: String,
});

const Ride = mongoose.model('Rides', RideSchema, 'rides');
export default Ride;