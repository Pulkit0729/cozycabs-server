import gql from 'graphql-tag';
import TemplatedRide from '../models/templatedRides';
import { IDriver } from '../models/drivers';
import { constructQuery } from '../utils/apollo.util';
import { isAdmin } from '../utils/permission.util';
import { shield } from 'graphql-shield';

export const templateTypeDefs = gql`
  type TemplatedRide {
    id: string!
    from: string!
    to: string!
    fromAddress: string!
    toAddress: string!
    fromLocation: Location
    toLocation: Location
    arrivalTime: string
    departureTime: string
    driver: Driver
    seats: Int!
    price: Int!
    discountedPrice: Int!
  }

  input TemplatedRideInput {
    from: string!
    to: string!
    fromAddress: string!
    toAddress: string!
    fromLocation: LocationInput!
    toLocation: LocationInput!
    arrivalTime: string!
    departureTime: string!
    driver: string!
    seats: Int!
    price: Int!
    discountedPrice: Int!
  }
  input TemplatedRideUpdateInput {
    from: string
    to: string
    fromAddress: string
    toAddress: string
    fromLocation: LocationInput
    toLocation: LocationInput
    arrivalTime: string
    departureTime: string
    driver: string
    seats: Int
    price: Int
    discountedPrice: Int
  }

  input TemplatedRideFilter {
    AND: [TemplatedRideFilter]
    OR: [TemplatedRideFilter]
    id: string
    from: string
    to: string
    fromAddress: string
    toAddress: string
    fromLocation: LocationInput
    toLocation: LocationInput
    arrivalTime: string
    departureTime: string
    driver: string
    seats: Int
    price: Int
    discountedPrice: Int
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
    updateTemplatedRide: async (_: any, { id, input }: any) => {
      try {
        const templatedRide = await TemplatedRide.findById(id);
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
