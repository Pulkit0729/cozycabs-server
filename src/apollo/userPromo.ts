import gql from 'graphql-tag';
import UserPromo from '../models/userPromos';
import { constructQuery } from '../utils/apollo.util';
import { isAdmin, isUserAuthenticated } from '../utils/permission.util';
import { or, shield } from 'graphql-shield';
import { getPromo } from '../dal/promo.dal';
import { getUser } from '../dal/user.dal';
import { getUserPromoByUser } from '../dal/userPromo.dal';
import logger from '../logger/logger';
import UserPromos from '../models/userPromos';

export const userpromosTypeDefs = gql`
  type UserPromo {
    id: string!
    name: string!
    description: string!
    type: string
    source: string
    termsAndConditions: [string]
    offAmount: Float
    percentage: Float
    maximumDiscount: Float
    minimumAmount: Float
    validUpto: Date
  }

  type UserPromos {
    id: string!
    userId: string!
    referredFrom: string
    promos: [UserPromo]
  }

  input UserPromoInput {
    promoId: string
    userId: string
    valid_for: Int
  }
  input UserPromoFilter {
    userId: string
    promoId: string
    name: string
  }
`;

export const userPromosResolvers = {
  Query: {
    userPromos: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const userpromos = await UserPromo.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return userpromos;
    },
  },
  Mutation: {
    addUserPromo: async (_: any, { input }: any) => {
      try {
        const { userId, promoId, validDays } = input;

        const promo = await getPromo(promoId);
        if (!promo) throw new Error('Promo not found');
        const user = await getUser(userId);
        if (!user) throw new Error('Promo not found');

        let userPromo = await getUserPromoByUser(userId);
        if (!userPromo) {
          const newUserPromos = new UserPromos({
            userId: userId,
            promos: [
              {
                ...promo,
                validUpto: validDays,
                createdDate: new Date(),
              },
            ],
          });
          await newUserPromos.save();
          userPromo = newUserPromos;
        } else {
          const userPromos = userPromo.promos;
          userPromos.push({
            ...promo,
            isReferral: false,
            validUpto: validDays,
            createdDate: new Date(),
          });
          userPromo.promos = userPromos;
          userPromo.markModified('promos');
          await userPromo.save();
        }
        return userPromo;
      } catch (error: any) {
        logger.error(`Promo Update API, error: ${error}`);
        return;
      }
    },
  },
};

export const userPrmoPermissions = shield({
  Query: {
    userPromos: or(isAdmin, isUserAuthenticated),
  },
  Mutation: {
    addUserPromo: isAdmin,
  },
});
