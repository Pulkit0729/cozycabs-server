import mongoose from 'mongoose';


export const UserPromoSchema = new mongoose.Schema({
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
    valid_upto: Date,
    created_date: Date,
});

export interface IUserPromos {
    id: String,
    userId: String,
    promos: [typeof UserPromoSchema],
    usedPromos: [],
    expiredPromos: []
}

const UserPromosSchema = new mongoose.Schema({
    id: String,
    userId: String,
    promos: [UserPromoSchema],
    usedPromos: [],
    expiredPromos: []
}, { timestamps: true });

const UserPromos = mongoose.model('UserPromos', UserPromosSchema, 'userPromos');
export default UserPromos;