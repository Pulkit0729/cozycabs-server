import { GraphQLScalarType, Kind } from 'graphql';
import Booking from '../models/bookings';
import { IRide } from '../models/rides';
import { IUser } from '../models/users';

import gql from 'graphql-tag';
import { constructQuery } from '../utils/apollo.util';
import { or, shield } from 'graphql-shield';
import {
  isAdmin,
  isDriverAuthenticated,
  isUserAuthenticated,
} from '../utils/permission.util';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    }
    throw Error('GraphQL Date Scalar serializer expected a `Date` object');
  },
  parseValue(value) {
    if (typeof value === 'number') {
      return new Date(value); // Convert incoming integer to Date
    }
    if (typeof value === 'string' && value.indexOf('-') != -1) {
      return new Date(value);
    }
    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      return new Date(parseFloat(value));
    }
    throw new Error('GraphQL Date Scalar parser expected a `number`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      const date = new Date(parseInt(ast.value, 10));
      date.setHours(5, 30);
      return date;
    }
    if (ast.kind === Kind.STRING) {
      const date = new Date(parseInt(ast.value, 10));
      date.setHours(5, 30);
      return date;
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});
export const bookingTypeDefs = gql(`

  type Booking {
    id: string!
    ride: Ride
    user: User
    seats: Int!
    total: Float!
    discountedTotal: Float!
    isPaid: Boolean!
    isCancelled: Boolean!
    status: string!
    channel: string!
  }
  input BookingInput {
    ride: string!
    user: string!
    seats: Int!
    total: Float!
    discountedTotal: Float!
    channel: string!
    isPaid: Boolean!
    isCancelled: Boolean!
    status: string!
  }
  input BookingUpdateInput {
    ride: string
    user: string
    seats: Int
    total: Float
    discountedTotal: Float
    channel: string
    isPaid: Boolean
    isCancelled: Boolean
    status: string
  }

  input BookingFilter {
    AND: [BookingFilter]
    OR: [BookingFilter]
    id: string
    ride: string
    user: string
    seats: Int
    total: Float
    channel: string
    discountedTotal: Float
    isPaid: Boolean
    isCancelled: Boolean
    status: string
  }`);

export const bookingResolvers = {
  Date: dateScalar,
  Query: {
    bookings: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const bookings = await Booking.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate<{ ride: IRide }>({
          path: 'ride',
          populate: { path: 'driver' },
        })
        .populate<{ user: IUser }>('user');
      return bookings;
    },
  },
  Mutation: {
    addBooking: (_: any, { input }: any) => {
      const newBook = new Booking(input);
      return newBook.save();
    },
    updateBooking: async (_: any, { bookingId, input }: any) => {
      try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
          throw new Error('Ride not found');
        }

        // Update booking properties if provided in the input
        if (input.isPaid) {
          booking.isPaid = input.isPaid;
        }
        if (input.isCancelled) {
          booking.isCancelled = input.isCancelled;
        }
        // Save the updated booking
        await booking.save();

        return booking;
      } catch (error: any) {
        throw new Error(`Failed to update ride: ${error.message}`);
      }
    },
  },
};

export const bookingPermissions = shield({
  Query: {
    bookings: or(isUserAuthenticated, isDriverAuthenticated, isAdmin),
  },
  Mutation: {
    addBooking: or(isUserAuthenticated, isAdmin),
    updateBooking: or(isUserAuthenticated, isAdmin),
  },
});
