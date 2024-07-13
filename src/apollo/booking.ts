import { GraphQLScalarType, Kind } from 'graphql';
import Booking from "../models/bookings";
import { IRide } from "../models/rides";
import { IUser } from "../models/users";

import gql from "graphql-tag";
import { constructQuery } from '../utils/apollo.util';
import { or, shield } from 'graphql-shield';
import { isAdmin, isUserAuthenticated } from '../utils/permission.util';

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
      let date = new Date(parseInt(ast.value, 10));
      date.setHours(5, 30);
      return date;
    }
    if (ast.kind === Kind.STRING) {
      let date = new Date(parseInt(ast.value, 10));
      date.setHours(5, 30);
      return date;
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
})
export const bookingTypeDefs = gql(`

  type Booking {
    id: String!
    ride: Ride
    user: User
    seats: Int!
    total: Float!
    discounted_total: Float!
    is_paid: Boolean!
    is_cancelled: Boolean!
    status: String!
    channel: String!
  }
  input BookingInput {
    ride: String!
    user: String!
    seats: Int!
    total: Float!
    discounted_total: Float!
    channel: String!
    is_paid: Boolean!
    is_cancelled: Boolean!
    status: String!
  }
  input BookingUpdateInput {
    ride: String
    user: String
    seats: Int
    total: Float
    discounted_total: Float
    channel: String
    is_paid: Boolean
    is_cancelled: Boolean
    status: String
  }

  input BookingFilter {
    AND: [BookingFilter]
    OR: [BookingFilter]
    id: String
    ride: String
    user: String
    seats: Int
    total: Float
    channel: String
    discounted_total: Float
    is_paid: Boolean
    is_cancelled: Boolean
    status: String
  }`);

export const bookingResolvers = {
  Date: dateScalar,
  Query: {

    bookings: async (_: any, { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder);
      const bookings = await Booking.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage).populate<{ ride: IRide }>({ path: 'ride', populate: { path: 'driver' } }).populate<{ user: IUser }>('user');
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
        if (input.is_paid) {
          booking.is_paid = input.is_paid;
        }
        if (input.is_cancelled) {
          booking.is_cancelled = input.is_cancelled;
        }
        // Save the updated booking
        await booking.save();

        return booking;
      } catch (error: any) {
        throw new Error(`Failed to update ride: ${error.message}`);
      }
    }
  },
};

export const bookingPermissions = shield({
  Query: {
    bookings: or(isUserAuthenticated, isAdmin),
  },
  Mutation: {
    addBooking: or(isUserAuthenticated, isAdmin),
    updateBooking: or(isUserAuthenticated, isAdmin),
  },
});


