import { gql } from "apollo-server-express";
import User from "../models/users";
import {constructQuery} from "../utils/apollo.util";

export const userTypeDef = gql`
type User {
    id: String!
    name: String!
    phone: String!
    email: String
    emailConfirmed: Boolean
    phoneConfirmed: Boolean
  }
  
  input UserInput {
    name: String!
    phone: String!
    email: String
  }
  
  input UserFilter {
    AND: [UserFilter]
    OR: [UserFilter]
    id: String
    name: String
    phone: String
  }`



export const userResolvers = {
  Query: {
    users: async (_: any, { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder)
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
    }
  },
};


