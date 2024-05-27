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
});

const Driver = mongoose.model('Drivers', DriverSchema, 'drivers');
export default Driver;