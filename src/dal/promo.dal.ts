import Promo, { IPromoFilter } from '../models/promos';

export async function getPromo(promoId: string) {
  return await Promo.findOne({ promoId: promoId }).then((promo) => {
    return promo;
  });
}
export async function searchPromo(filters: IPromoFilter) {
  return await Promo.findOne(filters).then((promo) => {
    return promo;
  });
}
