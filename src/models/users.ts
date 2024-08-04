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
    referralCode: String,
    fcm: {
        value: String,
        timestamp: Date
    }
}

export interface IUserFilter {
    id?: String,
    name?: String,
    phone?: String,
    email?: String,
    emailConfirmed?: Boolean,
    phoneConfirmed?: Boolean,
    phoneVerificationId?: number,
    salt?: String,
    hash?: String,
    referralCode?: String,
    fcm?: {
        value: String,
        timestamp: Date
    }
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
    referralCode: String,
    phoneVerificationId: Number,
    fcm: {
        value: String,
        timestamp: Date
    }
}, { timestamps: true });


const User = mongoose.model('Users', UserSchema, 'users');
export default User;