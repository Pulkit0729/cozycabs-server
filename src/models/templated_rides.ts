import mongoose, { Mongoose, Types } from 'mongoose';

export interface ITemplateRide {
    id: String,
    from: String,
    to: String,
    from_address: String,
    to_address: String,
    time: String,
    arrival_time: String,
    departure_time: String,
    driver: String,
    seats: number,
    price: number,
    discounted_price: number,
}


const TemplatedRideSchema = new mongoose.Schema({
    from: String,
    to: String,
    from_address: String,
    to_address: String,
    time: String,
    arrival_time: String,
    departure_time: String,
    driver: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Drivers'
    },
    seats: Number,
    price: Number,
    discounted_price: Number,
});

const TemplatedRide = mongoose.model('TemplatedRides', TemplatedRideSchema, 'templatedRides');
export default TemplatedRide;