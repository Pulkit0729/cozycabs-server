import mongoose from 'mongoose';

export enum PromoTypes {
    PERCENTAGE = 'percentage',
    FLAT = 'flat'
};

export enum PromoSources {
    ADMIN = 'admin',
    REFERRAL = 'referral',
    AUTOMATIC = 'automatic',
}

export interface IPromoFilter {
    id?: String,
    name?: String,
    type?: String,
    source?: String,
    description?: String,
    offAmount?: Number,
    percentage?: Number,
    maximumDiscount?: Number,
    minimumAmount?: Number,
}
export interface IPromo {
    id: String,
    name: String,
    type: String,
    source: String,
    description: String,
    termsAndConditions: [String],
    offAmount: Number,
    percentage: Number,
    maximumDiscount: Number,
    minimumAmount: Number,
}
export const PromoSchema = new mongoose.Schema<IPromo>({
    name: String,
    description: String,
    type: {
        type: String, enum: PromoTypes
    },
    source: {
        type: String, enum: PromoSources
    },
    termsAndConditions: [
        {
            type: String
        }
    ],
    offAmount: Number,
    percentage: Number,
    maximumDiscount: Number,
    minimumAmount: Number,

}, { timestamps: true });

const Promo = mongoose.model('Promos', PromoSchema, 'promos');
export default Promo;