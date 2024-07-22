import gql from "graphql-tag";
import UserPromo from "../models/userPromos";
import { constructQuery } from "../utils/apollo.util";
import { isAdmin, isUserAuthenticated } from "../utils/permission.util";
import { or, shield } from "graphql-shield";
import { getPromo } from "../dal/promo.dal";
import { getUser } from "../dal/user.dal";
import { getUserPromoByUser } from "../dal/userPromo.dal";
import logger from "../logger/logger";
import UserPromos from "../models/userPromos";

export const userpromoTypeDefs = gql`
  type UserPromo {
    id: String!
    name: String!
    description: String!
    type: String
    terms_and_conditions: [String]
    off_amount: Float
    percentage: Float
    maximum_discount: Float
    minimum_amount: Float
    valid_upto: Date
  }
  
  input UserPromoInput {
    promoId: String
    userId: String
    valid_for: Int
}
  input UserPromoFilter {
    userId: String
    rideId: String
    name: String
  }
    `

export const userPromoResolvers = {
    Query: {
        userPromos: async (_: any, { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any) => {
            let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder)
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
                    let newUserPromos = new UserPromos({
                        userId: userId,
                        promos: [
                            {
                                ...promo,
                                valid_upto: validDays,
                                created_date: new Date()
                            }
                        ]

                    });
                    await newUserPromos.save();
                    userPromo = newUserPromos;
                } else {
                    let userPromos = userPromo.promos;
                    userPromos.push({
                        ...promo,
                        valid_upto: validDays,
                        created_date: new Date()
                    });
                    userPromo.promos = userPromos;
                    userPromo.markModified('promos');
                    await userPromo.save();
                }
                return userPromo;

            } catch (error: any) {
                logger.error(`Promo Update API, error: ${error}`
                );
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
        addUserPromo: isAdmin
    },
});