import gql from 'graphql-tag';
import User from '../models/users';
import { constructQuery } from '../utils/apollo.util';
import { or, shield } from 'graphql-shield';
import { isAdmin, isUserAuthenticated } from '../utils/permission.util';

export const userTypeDef = gql`
  type User {
    id: string!
    name: string!
    phone: string!
    email: string
    referralCode: string
    emailConfirmed: Boolean
    phoneConfirmed: Boolean
  }

  input UserInput {
    name: string!
    phone: string!
    email: string
  }

  input UserFilter {
    AND: [UserFilter]
    OR: [UserFilter]
    id: string
    name: string
    phone: string
  }
`;

export const userResolvers = {
  Query: {
    users: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const users = await User.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return users;
    },
  },
  Mutation: {
    addUser: (_: any, { input }: any) => {
      const newUser = new User(input);
      return newUser.save();
    },
  },
};

export const userPermissions = shield({
  Query: {
    users: or(isUserAuthenticated, isAdmin),
  },
  Mutation: {
    addUser: or(isUserAuthenticated, isAdmin),
  },
});
