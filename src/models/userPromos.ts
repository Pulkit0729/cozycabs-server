import mongoose from 'mongoose';


export interface IUserPromo {
    name: String,
    description: String,
    type: String,
    source: String,
    isReferral: Boolean,
    terms_and_conditions: any[]
    off_amount: Number,
    percentage: Number,
    maximum_discount: Number,
    minimum_amount: Number,
    valid_upto: Date,
    created_date: Date,
}

export const UserPromoSchema = new mongoose.Schema<IUserPromo>({
    name: String,
    description: String,
    type: String,
    source: String,
    isReferral: Boolean,
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
    referredFrom: String,
    promos: [IUserPromo],
    usedPromos: [],
    expiredPromos: []
}

const UserPromosSchema = new mongoose.Schema<IUserPromos>({
    userId: String,
    referredFrom: String,
    promos: [UserPromoSchema],
    usedPromos: [],
    expiredPromos: []
}, { timestamps: true });

const UserPromos = mongoose.model('UserPromos', UserPromosSchema, 'userPromos');
export default UserPromos;