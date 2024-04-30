import mongoose, { Mongoose, Types } from 'mongoose';

const TemplatedRideSchema = new mongoose.Schema({
    from: String,
    to: String,
    time: String,
    driver_no: String,
    driver_name: String,
    seats: Number,
    price: Number,
});

const TemplatedRide = mongoose.model('TemplatedRides', TemplatedRideSchema, 'templatedRides');
export default TemplatedRide;