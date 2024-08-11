import gql from 'graphql-tag';
import { IDriver } from '../models/drivers';
import Ride from '../models/rides';
import { constructQuery } from '../utils/apollo.util';

export const rideTypeDefs = gql`
  type Ride {
    id: string!
    blabla_ride_id: string
    from: string!
    to: string!
    fromAddress: string!
    toAddress: string!
    fromLocation: Location!
    toLocation: Location!
    date: Date!
    arrivalTime: string
    departureTime: string
    driver: Driver
    seats: Int!
    price: Int!
    discountedPrice: Int!
    rideNo: Int!
    status: string!
    locationUrl: string
  }
  input RideInput {
    blabla_ride_id: string
    from: string!
    to: string!
    fromAddress: string!
    toAddress: string!
    fromLocation: LocationInput!
    toLocation: LocationInput!
    date: Date!
    arrivalTime: string!
    departureTime: string!
    driver: string!
    seats: Int!
    price: Int!
    discountedPrice: Int!
    rideNo: Int!
    status: string!
    locationUrl: string
  }
  input RideUpdateInput {
    blabla_ride_id: string
    from: string
    to: string
    fromAddress: string
    toAddress: string
    fromLocation: LocationInput
    toLocation: LocationInput
    date: Date
    arrivalTime: string
    departureTime: string
    driver: string
    seats: Int
    price: Int
    discountedPrice: Int
    rideNo: Int
    status: string
    locationUrl: string
  }

  input RideFilter {
    AND: [RideFilter]
    OR: [RideFilter]
    id: string
    blabla_ride_id: string
    from: string
    to: string
    fromAddress: string
    toAddress: string
    fromLocation: LocationInput
    toLocation: LocationInput
    date: Date
    arrivalTime: string
    departureTime: string
    driver: string
    seats: Int
    price: Int
    discountedPrice: Int
    rideNo: Int
    status: string
    locationUrl: string
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
      console.log(query, sortOptions);

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
    updateRide: async (_: any, { id, input }: any) => {
      try {
        const ride = await Ride.findById(id);
        if (!ride) {
          throw new Error('Ride not found');
        }

        // Update ride properties if provided in the input
        if (input.seats != false) {
          ride.status = input.status;
        }
        if (input.blabla_ride_id) {
          ride.blabla_ride_id = input.blabla_ride_id;
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
