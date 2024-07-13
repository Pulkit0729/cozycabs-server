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
    promotions: [String],
    fcm: {
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
    phoneVerificationId: Number,
    promotions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Promos' // I want to save an array of tags coming in from the request body
        }
    ],
    fcm: {
        value: String,
        timestamp: Date
    }
}, { timestamps: true });


const User = mongoose.model('Users', UserSchema, 'users');
export default User;