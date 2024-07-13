import mongoose, { Types } from 'mongoose';
import { ILocation } from './templated_rides';

export interface IRide {
    id: String,
    blabla_ride_id: String,
    from: String,
    from_location: ILocation,
    to: String,
    to_location: ILocation,
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
    navigationStatus: String,
}

const RideSchema = new mongoose.Schema<IRide>({
    blabla_ride_id: String,
    from: String,
    to: String,
    from_location: Object,
    to_location: Object,
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
    navigationStatus: String,
}, { timestamps: true });

const Ride = mongoose.model('Rides', RideSchema, 'rides');
export default Ride;