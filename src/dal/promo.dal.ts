import { FilterQuery } from 'mongoose';
import Promo, { IPromo } from '../models/promos';

export async function getPromo(promoId: string) {
  return await Promo.findOne({ promoId: promoId }).then((promo) => {
    return promo;
  });
}
export async function searchPromo(filters: FilterQuery<IPromo>) {
  return await Promo.findOne(filters).then((promo) => {
    return promo;
  });
}
