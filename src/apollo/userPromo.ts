import gql from 'graphql-tag';
import UserPromo from '../models/userPromos';
import { constructQuery } from '../utils/apollo.util';
import { isAdmin, isUserAuthenticated } from '../utils/permission.util';
import { or, shield } from 'graphql-shield';
import { getPromo } from '../dal/promo.dal';
import { getUser } from '../dal/user.dal';
import logger from '../logger/logger';
import { UserPromoService } from '../services/userpromo.service';

export const userpromosTypeDefs = gql`
  type UserPromo {
    id: String!
    userId: String!
    referredFrom: String
    promo: String!
    isUsed: Boolean
    validUpto: Date
  }

  input UserPromoInput {
    userId: String
    referredFrom: String
    promo: String
    isUsed: Boolean
    validUpto: Date
  }
  input UserPromoFilter {
    id: String
    userId: String
    referredFrom: String
    promo: String
    isUsed: Boolean
    validUpto: Date
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

        const userPromo = await UserPromoService.addPromoToUser(
          user,
          promo,
          validDays
        );

        return userPromo;
      } catch (error: any) {
        logger.error(`Promo Add API, error: ${error}`);
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
