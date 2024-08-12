import gql from 'graphql-tag';
import Promo from '../models/promos';
import { constructQuery } from '../utils/apollo.util';
import { isAdmin } from '../utils/permission.util';
import { shield } from 'graphql-shield';

export const promoTypeDefs = gql`
  type Promo {
    id: String!
    name: String!
    description: String!
    type: String
    source: String
    termsAndConditions: [String]
    offAmount: Float
    percentage: Float
    maximumDiscount: Float
    minimumAmount: Float
  }

  input PromoInput {
    name: String!
    description: String!
    type: String!
    source: String!
    termsAndConditions: [String]
    offAmount: Float!
    percentage: Float!
    maximumDiscount: Float!
    minimumAmount: Float!
  }
  input PromoUpdateInput {
    name: String
    description: String
    type: String
    source: String
    termsAndConditions: [String]
    offAmount: Float
    percentage: Float
    maximumDiscount: Float
    minimumAmount: Float
  }
  input PromoFilter {
    AND: [PromoFilter]
    OR: [PromoFilter]
    id: String
    name: String
    description: String
    type: String
    source: String
    termsAndConditions: [String]
    offAmount: Float
    percentage: Float
    maximumDiscount: Float
    minimumAmount: Float
  }
`;

export const promoResolvers = {
  Query: {
    promos: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const promos = await Promo.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return promos;
    },
  },
  Mutation: {
    addPromo: (_: any, { input }: any) => {
      const newUser = new Promo(input);
      return newUser.save();
    },
    updatePromo: async (_: any, { promoId, input }: any) => {
      try {
        const promo = await Promo.findById(promoId);
        if (!promo) {
          throw new Error('Promo not found');
        }
        // Update promo properties if provided in the input
        await promo.updateOne({ ...input });

        return await Promo.findById(promoId);
      } catch (error: any) {
        throw new Error(`Failed to update promo: ${error.message}`);
      }
    },
  },
};

export const prmoPermissions = shield({
  Query: {
    promos: isAdmin,
  },
  Mutation: {
    addPromo: isAdmin,
    updatePromo: isAdmin,
  },
});
