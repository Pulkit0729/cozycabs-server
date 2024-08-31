import gql from 'graphql-tag';
import { IDriver } from '../models/drivers';
import Ride from '../models/rides';
import { constructQuery } from '../utils/apollo.util';

export const rideTypeDefs = gql`
  type Ride {
    rideId: String!
    from: String!
    to: String!
    fromAddress: String!
    toAddress: String!
    fromLocation: Location!
    toLocation: Location!
    date: Date!
    arrivalTime: String
    departureTime: String
    driver: Driver
    seats: Int!
    price: Int!
    discountedPrice: Int!
    status: String!
    locationUrl: String
  }
  input RideInput {
    from: String!
    to: String!
    fromAddress: String!
    toAddress: String!
    fromLocation: LocationInput!
    toLocation: LocationInput!
    date: Date!
    arrivalTime: String!
    departureTime: String!
    driverId: String!
    seats: Int!
    price: Int!
    discountedPrice: Int!
    status: String!
    locationUrl: String
  }
  input RideUpdateInput {
    from: String
    to: String
    fromAddress: String
    toAddress: String
    fromLocation: LocationInput
    toLocation: LocationInput
    date: Date
    arrivalTime: String
    departureTime: String
    driverId: String
    seats: Int
    price: Int
    discountedPrice: Int
    status: String
    locationUrl: String
  }

  input RideFilter {
    AND: [RideFilter]
    OR: [RideFilter]
    rideId: String
    from: String
    to: String
    fromAddress: String
    toAddress: String
    fromLocation: LocationInput
    toLocation: LocationInput
    date: Date
    arrivalTime: String
    departureTime: String
    driverId: String
    seats: Int
    price: Int
    discountedPrice: Int
    status: String
    locationUrl: String
  }
`;

export const rideResolvers = {
  Query: {
    rides: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const rides = await Ride.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate<{ driver: IDriver }>('driver');
      return rides;
    },
  },
  Mutation: {
    addRide: (_: any, { input }: any) => {
      const newRide = new Ride(input);
      return newRide.save();
    },
    updateRide: async (_: any, { rideId, input }: any) => {
      try {
        const ride = await Ride.findOne({ rideId });
        if (!ride) {
          throw new Error('Ride not found');
        }

        // Update ride properties if provided in the input
        if (input.seats != false) {
          ride.status = input.status;
        }
        if (input.seats) {
          ride.seats = input.seats;
        }
        // Save the updated ride
        await ride.save();

        return ride;
      } catch (error: any) {
        throw new Error(`Failed to update ride: ${error.message}`);
      }
    },
  },
};
