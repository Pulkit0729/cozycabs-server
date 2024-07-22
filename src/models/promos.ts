import mongoose from 'mongoose';

export interface IPromo {
    id: String,
    name: String,
    type: String,
    description: String,
    terms_and_conditions: [String],
    off_amount: Number,
    percentage: Number,
    maximum_discount: Number,
    minimum_amount: Number,
}
export const PromoSchema = new mongoose.Schema({
    name: String,
    description: String,
    type: String,
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