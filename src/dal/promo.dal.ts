import Promo from "../models/promos";

export async function getPromo(id: string) {
  return await Promo.findOne({ _id: id }).then((promo) => {
    return promo;
  });
}

