import gql from "graphql-tag";
import Driver from "../models/drivers";
import { constructQuery } from "../utils/apollo.util";
import { or, rule, shield } from "graphql-shield";
import { isAdmin, isDriverAuthenticated } from "../utils/permission.util";

export const driverTypeDefs = gql`
  type Driver {
    id: String!
    name: String!
    phone: String!
    email: String
    car_name: String
    car_no: String
    emailConfirmed: Boolean
    phoneConfirmed: Boolean
  }
  
  input DriverInput {
    name: String!
    phone: String!
    email: String
    car_name: String
    car_no: String
  }
  input DriverFilter {
    AND: [DriverFilter]
    OR: [DriverFilter]
    id: String
    name: String
    phone: String
    email: String
    car_name: String
    car_no: String
  }`

export const driverResolvers = {
  Query: {
    drivers: async (_: any, { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder)
      const drivers = await Driver.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return drivers;
    },
  },
  Mutation: {
    addDriver: (_: any, { input }: any) => {
      const newUser = new Driver(input);
      return newUser.save();
    }
  },
};


export const driverPermissions = shield({
  Query: {
    drivers: or(isDriverAuthenticated, isAdmin),
  },
  Mutation: {
    addDriver: or(isDriverAuthenticated, isAdmin),
  },
})

