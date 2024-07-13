import gql from "graphql-tag";
import Promo from "../models/promos";
import { constructQuery } from "../utils/apollo.util";
import { isAdmin, isUserAuthenticated } from "../utils/permission.util";
import { or, shield } from "graphql-shield";

export const promoTypeDefs = gql`
  type Promo {
    id: String!
    name: String!
    description: String!
    type: String
    terms_and_conditions: [String]
    off_amount: Float
    percentage: Float
    maximum_discount: Float
    minimum_amount: Float
  }
  
  input PromoInput {
    name: String!
    description: String!
    type: String!
    terms_and_conditions: [String]
    off_amount: Float!
    percentage: Float!
    maximum_discount: Float!
    minimum_amount: Float!
  }
  input PromoUpdateInput {
    name: String
    description: String
    type: String
    terms_and_conditions: [String]
    off_amount: Float
    percentage: Float
    maximum_discount: Float
    minimum_amount: Float
  }
  input PromoFilter {
    AND: [PromoFilter]
    OR: [PromoFilter]
    id: String
    name: String
    description: String
    type: String
    terms_and_conditions: [String]
    off_amount: Float
    percentage: Float
    maximum_discount: Float
    minimum_amount: Float
  }`

export const promoResolvers = {
  Query: {
    promos: async (_: any, { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder)
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

        return await Promo.findById(promoId);;
      } catch (error: any) {
        throw new Error(`Failed to update promo: ${error.message}`);
      }
    }
  },
};

export const prmoPermissions = shield({
  Query: {
    promos: or(isUserAuthenticated, isAdmin),
  },
  Mutation: {
    addPromo: or(isUserAuthenticated, isAdmin),
    updatePromo: or(isUserAuthenticated, isAdmin),
  },
});