import mongoose, { Schema, Types } from 'mongoose';

export interface IUser extends Document {
  userId: Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  emailConfirmed: Boolean;
  phoneConfirmed: Boolean;
  phoneVerificationId: number;
  salt: string;
  hash: string;
  referralCode: string;
  fcm: {
    value: string;
    timestamp: Date;
  };
}

export interface IUserFilter {
  userId?: Types.ObjectId;
  name?: string;
  phone?: string;
  email?: string;
  emailConfirmed?: Boolean;
  phoneConfirmed?: Boolean;
  phoneVerificationId?: number;
  salt?: string;
  hash?: string;
  referralCode?: string;
  fcm?: {
    value: string;
    timestamp: Date;
  };
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
      unique: true,
    },
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
      timestamp: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('Users', UserSchema, 'users');
export default User;
