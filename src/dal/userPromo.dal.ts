import {
  FilterQuery,
  Schema,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { IPromo, PromoSources } from '../models/promos';
import UserPromo, { IUserPromo } from '../models/userPromos';

export async function getUserPromo(id: Schema.Types.ObjectId) {
  return await UserPromo.findOne({ _id: id })
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
  return await UserPromo.find({ userId: userId, promo: promoId, ...filters })
    .populate<{ promo: IPromo }>('promo')
    .then((promos) => {
      return promos;
    });
}

export async function getUserPromoBySource(
  userId: string,
  source: PromoSources
) {
  return await UserPromo.find({ userId: userId, 'promo.source': source })
    .populate<{ promo: IPromo }>('promo')
    .then((promos) => {
      return promos;
    });
}

export async function getValidUserPromo(userId: string) {
  return await UserPromo.find({
    userId: userId,
    validUpto: { $gte: new Date() },
  })
    .populate<{ promo: IPromo }>('promo')
    .then((promos) => {
      return promos;
    });
}

export async function updateUserPromo(
  id: any,
  update: UpdateWithAggregationPipeline | UpdateQuery<IUserPromo> | undefined
) {
  return await UserPromo.updateOne({ _id: id }, update);
}
