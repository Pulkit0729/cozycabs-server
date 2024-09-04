import gql from 'graphql-tag';
import { constructQuery } from '../utils/apollo.util';
import Point from '../models/points';

export const pointTypeDefs = gql`
  type Point {
    pointId: String
    location: Location
    templateRideId: String
    type: String
    extraCost: Float
    distanceFromRoute: Float
    onRoute: Boolean
    label: String
    landmark: String
  }

  input PointInput {
    location: LocationInput!
    templateRideId: String!
    type: String!
    extraCost: Float!
    distanceFromRoute: Float!
    onRoute: Boolean!
    label: String!
    landmark: String!
  }
  input PointUpdateInput {
    location: LocationInput
    templateRideId: String
    type: String
    extraCost: Float
    distanceFromRoute: Float
    onRoute: Boolean
    label: String
    landmark: String
  }
  input PointFilter {
    AND: [PointFilter]
    OR: [PointFilter]
    templateRideId: String
    type: String
    extraCost: Float
    distanceFromRoute: Float
    onRoute: Boolean
    label: String
    landmark: String
  }
`;

export const pointResolvers = {
  Query: {
    points: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const points = await Point.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return points;
    },
  },
  Mutation: {
    addPoint: (_: any, { input }: any) => {
      const newUser = new Point(input);
      return newUser.save();
    },
    addBulkPoints: async (_: any, { input }: any) => {
      const newPoints = await Point.bulkSave(input);
      return newPoints;
    },
    updatePoint: async (_: any, { pointId, input }: any) => {
      try {
        const point = await Point.findOne({ pointId });
        if (!point) {
          throw new Error('Point not found');
        }
        // Update point properties if provided in the input
        await point.updateOne({ ...input });

        return await Point.findOne({ pointId });
      } catch (error: any) {
        throw new Error(`Failed to update point: ${error.message}`);
      }
    },
  },
};
