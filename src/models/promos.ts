import mongoose, { Schema } from 'mongoose';

export enum PromoTypes {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
}

export enum PromoSources {
  ADMIN = 'admin',
  REFERRAL = 'referral',
  AUTOMATIC = 'automatic',
}

export interface IPromoFilter {
  id?: string;
  name?: string;
  type?: string;
  source?: string;
  description?: string;
  offAmount?: number;
  percentage?: number;
  maximumDiscount?: number;
  minimumAmount?: number;
}
export interface IPromo {
  id: Schema.Types.ObjectId;
  name: string;
  type: string;
  source: string;
  description: string;
  termsAndConditions: string[];
  offAmount: number;
  percentage: number;
  maximumDiscount: number;
  minimumAmount: number;
}
export const PromoSchema = new mongoose.Schema<IPromo>(
  {
    name: String,
    description: String,
    type: {
      type: String,
      enum: PromoTypes,
    },
    source: {
      type: String,
      enum: PromoSources,
    },
    termsAndConditions: [
      {
        type: String,
      },
    ],
    offAmount: Number,
    percentage: Number,
    maximumDiscount: Number,
    minimumAmount: Number,
  },
  { timestamps: true }
);

const Promo = mongoose.model('Promos', PromoSchema, 'promos');
export default Promo;
