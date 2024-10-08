import gql from 'graphql-tag';
import { constructQuery } from '../utils/apollo.util';
import { or, shield } from 'graphql-shield';
import { isAdmin, isUserAuthenticated } from '../utils/permission.util';
import Review from '../models/review';

export const reviewTypeDefs = gql`
  type Review {
    reviewId: String
    bookingId: String
    rideId: String
    driverId: String
    userId: String
    rating: Float
    review: String
  }

  input ReviewInput {
    bookingId: String
    rideId: String
    driverId: String
    userId: String
    rating: Float
    review: String
  }

  input ReviewUpdateInput {
    bookingId: String
    rideId: String
    driverId: String
    userId: String
    rating: Float
    review: String
  }

  input ReviewFilter {
    AND: [ReviewFilter]
    OR: [ReviewFilter]
    bookingId: String
    reviewId: String
    rideId: String
    driverId: String
    userId: String
    rating: Float
    review: String
  }
`;

export const reviewResolvers = {
  Query: {
    reviews: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const reviews = await Review.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return reviews;
    },
  },
  Mutation: {
    addReview: (_: any, { input }: any) => {
      const newReview = new Review(input);
      return newReview.save();
    },
    updateReview: async (_: any, { reviewId, input }: any) => {
      try {
        await Review.updateOne({ reviewId }, { ...input });
        const review = await Review.findOne({ reviewId });
        return review;
      } catch (error: any) {
        throw new Error(`Failed to update review: ${error.message}`);
      }
    },
  },
};

export const reviewPermissions = shield({
  Query: {
    reviews: or(isUserAuthenticated, isAdmin),
  },
  Mutation: {
    addReview: or(isUserAuthenticated, isAdmin),
  },
});
