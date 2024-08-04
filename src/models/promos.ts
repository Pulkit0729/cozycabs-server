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
    off_amount?: Number,
    percentage?: Number,
    maximum_discount?: Number,
    minimum_amount?: Number,
}
export interface IPromo {
    id: String,
    name: String,
    type: String,
    source: String,
    description: String,
    terms_and_conditions: [String],
    off_amount: Number,
    percentage: Number,
    maximum_discount: Number,
    minimum_amount: Number,
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
    terms_and_conditions: [
        {
            type: String
        }
    ],
    off_amount: Number,
    percentage: Number,
    maximum_discount: Number,
    minimum_amount: Number,

}, { timestamps: true });

const Promo = mongoose.model('Promos', PromoSchema, 'promos');
export default Promo;