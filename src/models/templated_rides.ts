import mongoose from 'mongoose';

export interface ILocation {
    type: string;
    coordinates: any[];
}
export interface ITemplateRide {
    id: String,
    from: String,
    from_location: ILocation,
    to: String,
    to_location: ILocation,
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
    from_location: Object,
    to_location: Object,
    seats: Number,
    price: Number,
    discounted_price: Number,
}, { timestamps: true });

const TemplatedRide = mongoose.model('TemplatedRides', TemplatedRideSchema, 'templatedRides');
export default TemplatedRide;