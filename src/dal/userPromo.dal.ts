import {
  FilterQuery,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { IPromo } from '../models/promos';
import UserPromo, { IUserPromo } from '../models/userPromos';

export async function getUserPromo(userPromoId: string) {
  return await UserPromo.findOne({ userPromoId: userPromoId })
    .populate<{ promo: IPromo }>('promo')
    .then((userPromos) => {
      return userPromos;
    });
}

export async function searchUserPromos(filter: FilterQuery<IUserPromo>) {
  return await UserPromo.find(filter)
    .populate<{ promo: IPromo }>('promo')
    .then((promos) => {
      return promos;
    });
}

export async function getUserPromoByUser(userId: string) {
  return await UserPromo.find({ userId: userId })
    .populate<{ promo: IPromo }>('promo')
    .then((promos) => {
      return promos;
    });
}

export async function getUserPromoByPromo(
  userId: string,
  promoId: string,
  filters: {} = {}
) {
  return await UserPromo.find({ userId: userId, promoId: promoId, ...filters })
    .populate<{ promo: IPromo }>('promo')
    .then((promos) => {
      return promos;
    });
}

export async function getReferralUserPromo(userId: string) {
  return await UserPromo.find({
    $and: [
      { userId: userId },
      { $or: [{ referredFrom: { $ne: '' } }, { referredFrom: { $ne: null } }] },
    ],
  })
    .populate<{ promo: IPromo }>('promo')
    .then((promos) => {
      return promos;
    });
}

export async function getValidUserPromo(userId: string) {
  return await UserPromo.find({
    userId: userId,
    isUsed: false,
    validUpto: { $gte: new Date() },
  })
    .populate<{ promo: IPromo }>('promo')
    .then((promos) => {
      return promos;
    });
}

export async function updateUserPromo(
  userPromoId: any,
  update: UpdateWithAggregationPipeline | UpdateQuery<IUserPromo> | undefined
) {
  return await UserPromo.updateOne({ userPromoId: userPromoId }, update);
}
