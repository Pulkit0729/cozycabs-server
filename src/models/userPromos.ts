import mongoose, { Schema } from 'mongoose';
export interface IUserPromo {
  id: string;
  userId: string;
  referredFrom: string;
  promo: Schema.Types.ObjectId;
  isUsed: boolean;
  validUpto: Date;
}

const UserPromoSchema = new mongoose.Schema<IUserPromo>(
  {
    userId: String,
    referredFrom: String,
    promo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Promos',
    },
    isUsed: Boolean,
    validUpto: Date,
  },
  { timestamps: true }
);

const UserPromo = mongoose.model('UserPromos', UserPromoSchema, 'userPromos');
export default UserPromo;
