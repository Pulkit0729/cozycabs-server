import mongoose from 'mongoose';


export interface IUserPromo {
    id: String,
    name: String,
    description: String,
    type: String,
    source: String,
    isReferral: Boolean,
    termsAndConditions: any[]
    offAmount: Number,
    percentage: Number,
    maximumDiscount: Number,
    minimumAmount: Number,
    validUpto: Date,
    createdDate: Date,
}

export const UserPromoSchema = new mongoose.Schema<IUserPromo>({
    name: String,
    description: String,
    type: String,
    source: String,
    isReferral: Boolean,
    termsAndConditions: [
        {
            type: String
        }
    ],
    offAmount: Number,
    percentage: Number,
    maximumDiscount: Number,
    minimumAmount: Number,
    validUpto: Date,
    createdDate: Date,
});

export interface IUserPromos {
    id: String,
    userId: String,
    referred_from: String,
    promos: [IUserPromo],
    usedPromos: [],
    expiredPromos: []
}

const UserPromosSchema = new mongoose.Schema<IUserPromos>({
    userId: String,
    referred_from: String,
    promos: [UserPromoSchema],
    usedPromos: [],
    expiredPromos: []
}, { timestamps: true });

const UserPromos = mongoose.model('UserPromos', UserPromosSchema, 'userPromos');
export default UserPromos;