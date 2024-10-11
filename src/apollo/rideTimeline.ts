import gql from 'graphql-tag';
import { constructQuery } from '../utils/apollo.util';
import RideTimeline from '../models/rideTimeline';

export const rideTimelineTypeDefs = gql`
  type HistoryInstance {
    status: String
    time: Date
  }
  input HistoryInstanceInput {
    status: String
    time: Date
  }

  type RideTimeline {
    rideId: String
    history: [HistoryInstance]
  }

  input RideTimelineInput {
    rideId: String
    history: [HistoryInstanceInput]
  }

  input RideTimelineFilter {
    AND: [RideTimelineFilter]
    OR: [RideTimelineFilter]
    rideId: String
  }
`;

export const rideTimelineResolvers = {
  Query: {
    rideTimeline: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const rideTimelines = await RideTimeline.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return rideTimelines;
    },
  },
  Mutation: {
    addRideTimeline: (_: any, { input }: any) => {
      const newRideTimeline = new RideTimeline(input);
      return newRideTimeline.save();
    },
  },
};
