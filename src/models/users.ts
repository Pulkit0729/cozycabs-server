import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName :String,
    phone: {
        type: String,
        default : null,
        
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,

    },
    
    emailConfirmed: Boolean,
    phoneConfirmed: Boolean,
    salt: String,
    hash: String,

});


const User = mongoose.model('Users', UserSchema, 'users');
export default User;