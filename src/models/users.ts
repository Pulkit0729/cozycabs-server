import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name:String,
    phone: String

});

const User= mongoose.model('Users', UserSchema, 'users');
export default User;