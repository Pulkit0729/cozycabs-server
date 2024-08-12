import gql from 'graphql-tag';
import TermsAndCondition from '../models/termsAndCoditions';
import { constructQuery } from '../utils/apollo.util';
import { or, shield } from 'graphql-shield';
import { isAdmin, isUserAuthenticated } from '../utils/permission.util';
import GraphQLJSON from 'graphql-type-json';

export const termsandconditionTypeDefs = gql`
  type TermsAndCondition {
    id: String!
    name: String!
    value: JSON
  }

  input TermsAndConditionInput {
    name: String!
    value: JSON
  }

  input TermsAndConditionUpdateInput {
    name: String
    value: JSON
  }

  input TermsAndConditionFilter {
    AND: [TermsAndConditionFilter]
    OR: [TermsAndConditionFilter]
    id: String
    name: String
  }
`;

export const termsandconditionResolvers = {
  JSON: GraphQLJSON,
  Query: {
    termsAndConditions: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const termsandconditions = await TermsAndCondition.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return termsandconditions;
    },
  },
  Mutation: {
    addTermsAndCondition: (_: any, { input }: any) => {
      const newUser = new TermsAndCondition(input);
      return newUser.save();
    },
  },
};

export const termsandconditionPermissions = shield({
  Query: {
    termsAndConditions: or(isUserAuthenticated, isAdmin),
  },
  Mutation: {
    addTermsAndCondition: or(isUserAuthenticated, isAdmin),
  },
});
