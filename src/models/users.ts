import mongoose from 'mongoose';

export interface IUser {
    id: String,
    name: String,
    phone: String,
    email: String,
    emailConfirmed: Boolean,
    phoneConfirmed: Boolean,
    phoneVerificationId: number,
    salt: String,
    hash: String,
}

const UserSchema = new mongoose.Schema<IUser>({
    name: String,
    phone: {
        type: String,
        default: null,
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
    phoneVerificationId: Number,
});


const User = mongoose.model('Users', UserSchema, 'users');
export default User;