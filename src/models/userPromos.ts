import mongoose, { Schema, Types } from 'mongoose';
export interface IUserPromo extends Document {
  userPromoId: Types.ObjectId;
  userId: string;
  referredFrom: string;
  promoId: Types.ObjectId;
  isUsed: boolean;
  validUpto: Date;
}

const UserPromoSchema = new mongoose.Schema<IUserPromo>(
  {
    userPromoId: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
      unique: true,
    },
    userId: String,
    referredFrom: String,
    promoId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    isUsed: Boolean,
    validUpto: Date,
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

UserPromoSchema.virtual('promo', {
  ref: 'Promos',
  localField: 'promoId',
  foreignField: 'promoId',
  justOne: true,
});

const UserPromo = mongoose.model('UserPromos', UserPromoSchema, 'userPromos');
export default UserPromo;
