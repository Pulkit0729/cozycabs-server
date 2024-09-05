import gql from 'graphql-tag';
import BookingPoint from '../models/bookingPoints';
import { constructQuery } from '../utils/apollo.util';
import { IPoint } from '../models/points';

export const bookingPointTypeDefs = gql`
  type BookingPoint {
    bookingId: String
    dropId: String
    drop: Point
    pickupId: String
    pickup: Point
  }

  input BookingPointInput {
    bookingId: String
    dropId: String
    pickupId: String
  }
  input BookingPointUpdateInput {
    bookingId: String
    dropId: String
    pickupId: String
  }
  input BookingPointFilter {
    AND: [BookingPointFilter]
    OR: [BookingPointFilter]
    bookingId: String
    dropId: String
    pickupId: String
  }
`;

export const bookingPointResolvers = {
  Query: {
    bookingPoints: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const bookingPoints = await BookingPoint.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate<{ pickup: IPoint }>('pickup')
        .populate<{ drop: IPoint }>('drop');
      return bookingPoints;
    },
  },
  Mutation: {
    addBookingPoint: (_: any, { input }: any) => {
      const newUser = new BookingPoint(input);
      return newUser.save();
    },
    updateBookingPoint: async (_: any, { bookingPointId, input }: any) => {
      try {
        const bookingPoint = await BookingPoint.findOne({ bookingPointId });
        if (!bookingPoint) {
          throw new Error('BookingPoint not found');
        }
        // Update bookingPoint properties if provided in the input
        await bookingPoint.updateOne({ ...input });

        return await BookingPoint.findOne({ bookingPointId });
      } catch (error: any) {
        throw new Error(`Failed to update bookingPoint: ${error.message}`);
      }
    },
  },
};
