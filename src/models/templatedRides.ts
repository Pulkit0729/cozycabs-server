import mongoose from 'mongoose';

export interface ILocation {
    type: string;
    coordinates: any[];
}
export interface ITemplateRide {
    id: String,
    from: String,
    fromLocation: ILocation,
    to: String,
    toLocation: ILocation,
    fromAddress: String,
    toAddress: String,
    time: String,
    arrivalTime: String,
    departureTime: String,
    driver: String,
    seats: number,
    price: number,
    discountedPrice: number,
}

const TemplatedRideSchema = new mongoose.Schema({
    from: String,
    to: String,
    fromAddress: String,
    toAddress: String,
    time: String,
    arrivalTime: String,
    departureTime: String,
    driver: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Drivers'
    },
    fromLocation: Object,
    toLocation: Object,
    seats: Number,
    price: Number,
    discountedPrice: Number,
}, { timestamps: true });

const TemplatedRide = mongoose.model('TemplatedRides', TemplatedRideSchema, 'templatedRides');
export default TemplatedRide;