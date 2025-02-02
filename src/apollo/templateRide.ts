import gql from 'graphql-tag';
import TemplatedRide from '../models/templatedRides';
import { IDriver } from '../models/drivers';
import { constructQuery } from '../utils/apollo.util';
import { isAdmin } from '../utils/permission.util';
import { shield } from 'graphql-shield';

export const templateTypeDefs = gql`
  type TemplatedRide {
    templateRideId: String!
    from: String!
    to: String!
    fromAddress: String!
    toAddress: String!
    fromLocation: Location
    toLocation: Location
    arrivalTime: String
    departureTime: String
    driver: Driver
    seats: Int!
    price: Int!
    discountedPrice: Int!
    status: String
  }

  input TemplatedRideInput {
    from: String!
    to: String!
    fromAddress: String!
    toAddress: String!
    fromLocation: LocationInput!
    toLocation: LocationInput!
    arrivalTime: String!
    departureTime: String!
    driverId: String!
    seats: Int!
    price: Int!
    discountedPrice: Int!
    status: String!
  }
  input TemplatedRideUpdateInput {
    from: String
    to: String
    fromAddress: String
    toAddress: String
    fromLocation: LocationInput
    toLocation: LocationInput
    arrivalTime: String
    departureTime: String
    driverId: String
    seats: Int
    price: Int
    discountedPrice: Int
    status: String
  }

  input TemplatedRideFilter {
    AND: [TemplatedRideFilter]
    OR: [TemplatedRideFilter]
    templateRideId: String
    from: String
    to: String
    fromAddress: String
    toAddress: String
    fromLocation: LocationInput
    toLocation: LocationInput
    arrivalTime: String
    departureTime: String
    driverId: String
    seats: Int
    price: Int
    discountedPrice: Int
    status: String
  }
`;

export const templateResolvers = {
  Query: {
    templatedRides: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const rides = await TemplatedRide.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate<{ driver: IDriver }>('driver');
      return rides;
    },
  },
  Mutation: {
    addTemplatedRide: (_: any, { input }: any) => {
      const newRide = new TemplatedRide(input);
      return newRide.save();
    },
    updateTemplatedRide: async (_: any, { templateRideId, input }: any) => {
      try {
        const templatedRide = await TemplatedRide.findOne({ templateRideId });
        if (!templatedRide) {
          throw new Error('Ride not found');
        }

        // Update templatedRide properties if provided in the input
        if (input.arrivalTime) {
          templatedRide.time = input.arrivalTime;
        }
        if (input.departureTime) {
          templatedRide.time = input.departureTime;
        }
        if (input.seats) {
          templatedRide.seats = input.seats;
        }
        if (input.price) {
          templatedRide.price = input.price;
        }
        if (input.discountedPrice) {
          templatedRide.discountedPrice = input.discountedPrice;
        }
        // Save the updated templatedRide
        await templatedRide.save();

        return templatedRide;
      } catch (error: any) {
        throw new Error(`Failed to update templatedRide: ${error.message}`);
      }
    },
  },
};

export const templateRidePermissions = shield({
  Query: {
    templatedRides: isAdmin,
  },
  Mutation: {
    addTemplatedRide: isAdmin,
    updateTemplatedRide: isAdmin,
  },
});
