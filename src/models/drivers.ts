import mongoose from 'mongoose';


export interface IDriver {
    id: String,
    name: String,
    email: String,
    phone: String,
    car_name: String,
    car_no: String,
    emailConfirmed: Boolean,
    phoneConfirmed: Boolean,
    phoneVerificationId: number,
    fcm: {
        value: String,
        timestamp: Date
    }
}
const DriverSchema = new mongoose.Schema<IDriver>({
    name: String,
    email: String,
    phone: String,
    car_name: String,
    car_no: String,
    emailConfirmed: Boolean,
    phoneConfirmed: Boolean,
    phoneVerificationId: Number,
    fcm: {
        value: String,
        timestamp: Date
    }
},  { timestamps: true });

const Driver = mongoose.model('Drivers', DriverSchema, 'drivers');
export default Driver;