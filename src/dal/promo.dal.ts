import Promo, { IPromoFilter } from "../models/promos";

export async function getPromo(id: string) {
  return await Promo.findOne({ _id: id }).then((promo) => {
    return promo;
  });
}
export async function searchPromo(filters: IPromoFilter) {
  return await Promo.findOne(filters).then((promo) => {
    return promo;
  });
}
