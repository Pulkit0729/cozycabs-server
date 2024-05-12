import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
    blabla_ride_id: {
        type: String,
        required: false
    },
    from: String,
    to: String,
    from_address: String,
    to_address: String,
    date: String,
    time: String,
    arrival_time: String,
    departure_time: String,
    driver_no: String,
    driver_name: String,
    seats: Number,
    price: Number,
    discounted_price: Number,
    ride_no: {
        type: Number,
        unique: true,
    },
    status: String,
});

const Ride = mongoose.model('Rides', RideSchema, 'rides');
export default Ride;