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


export async function getValidUserPromoByUser(userId: string) {
  return await UserPromos.aggregate(
    [
      {
        $match: {
          userId: userId
        }
      },
      {
        $unwind: {
          path: "$promos",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          "promos.validUpto": {
            $gt: new Date()
          }
        }
      },
      {
        $group:
        {
          _id: "$_id",
          userId: {
            $first: "$userId"
          },
          promos: {
            $push: "$promos"
          }

        }
      }
    ]
  );
}

