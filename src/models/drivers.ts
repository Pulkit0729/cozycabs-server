import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
    name:String,
    email: String,
    phone: String,
    car_name: String,
    car_no: String,
});

const Driver= mongoose.model('Drivers', DriverSchema, 'drivers');
export default Driver;