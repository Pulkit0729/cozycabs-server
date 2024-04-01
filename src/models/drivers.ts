import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
    name:String,
    email: String,
    phone: String

});

const Driver= mongoose.model('Drivers', DriverSchema, 'drivers');
export default Driver;