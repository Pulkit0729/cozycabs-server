import mongoose from 'mongoose';
import { ILocation } from './templatedRides';


export interface IDriver {
    id: String,
    name: String,
    email: String,
    phone: String,
    carName: String,
    carNo: String,
    phoneConfirmed: Boolean,
    emailConfirmed: Boolean,
    phoneVerificationId: number,
    fcm: {
        value: String,
        timestamp: Date
    },
    currentLocation: ILocation

}
const DriverSchema = new mongoose.Schema<IDriver>({
    name: String,
    email: String,
    phone: String,
    carName: String,
    carNo: String,
    emailConfirmed: Boolean,
    phoneConfirmed: Boolean,
    phoneVerificationId: Number,
    fcm: {
        value: String,
        timestamp: Date
    },
    currentLocation: Object,

}, { timestamps: true });

const Driver = mongoose.model('Drivers', DriverSchema, 'drivers');
export default Driver;