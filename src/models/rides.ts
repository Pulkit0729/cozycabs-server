import mongoose, { Types } from 'mongoose';
import { ILocation } from './templatedRides';

export interface IRide {
    id: String,
    blabla_ride_id: String,
    from: String,
    fromLocation: ILocation,
    to: String,
    toLocation: ILocation,
    fromAddress: String,
    toAddress: String,
    date: String,
    time: String,
    arrivalTime: String,
    departureTime: String,
    driver: Types.ObjectId,
    seats: number,
    price: number,
    discountedPrice: number,
    rideNo: number,
    locationUrl: String | undefined,
    status: String,
    navigationStatus: String,
}

const RideSchema = new mongoose.Schema<IRide>({
    blabla_ride_id: String,
    from: String,
    to: String,
    fromLocation: Object,
    toLocation: Object,
    fromAddress: String,
    toAddress: String,
    date: Date,
    time: String,
    arrivalTime: String,
    departureTime: String,
    driver: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Drivers'
    },
    seats: Number,
    price: Number,
    discountedPrice: Number,
    rideNo: {
        type: Number,
        unique: true,
    },
    status: String,
    locationUrl: String,
    navigationStatus: String,
}, { timestamps: true });

const Ride = mongoose.model('Rides', RideSchema, 'rides');
export default Ride;