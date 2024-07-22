import UserPromos from "../models/userPromos";

export async function getUserPromo(id: string) {
  return await UserPromos.findOne({ _id: id }).then((promo) => {
    return promo;
  });
}

export async function getUserPromoByUser(userId: string) {
  return await UserPromos.findOne({ userId: userId }).then((promo) => {
    return promo;
  });
}

