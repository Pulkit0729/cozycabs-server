import mongoose, { Types } from 'mongoose';

export interface IRide {
    id: String,
    blabla_ride_id: String,
    from: String,
    to: String,
    from_address: String,
    to_address: String,
    date: String,
    time: String,
    arrival_time: String,
    departure_time: String,
    driver: Types.ObjectId,
    seats: number,
    price: number,
    discounted_price: number,
    ride_no: number,
    location_url: String | undefined,
    status: String,
}

const RideSchema = new mongoose.Schema<IRide>({
    blabla_ride_id: {
        type: String,
        required: false
    },
    from: String,
    to: String,
    from_address: String,
    to_address: String,
    date: Date,
    time: String,
    arrival_time: String,
    departure_time: String,
    driver: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Drivers'
    },
    seats: Number,
    price: Number,
    discounted_price: Number,
    ride_no: {
        type: Number,
        unique: true,
    },
    status: String,
    location_url: String,
});

const Ride = mongoose.model('Rides', RideSchema, 'rides');
export default Ride;