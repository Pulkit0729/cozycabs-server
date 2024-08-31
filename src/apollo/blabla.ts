import gql from 'graphql-tag';
import Blabla from '../models/blabla';
import { constructQuery } from '../utils/apollo.util';
import { isAdmin } from '../utils/permission.util';
import { shield } from 'graphql-shield';

export const blablaTypeDefs = gql`
  type Blabla {
    blablaId: String
    rideId: String
    price: Float
  }

  input BlablaInput {
    blablaId: String!
    rideId: String!
    price: Float!
  }
  input BlablaUpdateInput {
    blablaId: String
    rideId: String
    price: Float
  }
  input BlablaFilter {
    AND: [BlablaFilter]
    OR: [BlablaFilter]
    blablaId: String
    rideId: String
    price: Float
  }
`;

export const blablaResolvers = {
  Query: {
    blablas: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const blablas = await Blabla.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return blablas;
    },
  },
  Mutation: {
    addBlabla: (_: any, { input }: any) => {
      const newUser = new Blabla(input);
      return newUser.save();
    },
    updateBlabla: async (_: any, { blablaId, input }: any) => {
      try {
        const blabla = await Blabla.findOne({ blablaId: blablaId });
        if (!blabla) {
          throw new Error('Blabla not found');
        }
        // Update blabla properties if provided in the input
        await blabla.updateOne({ ...input });

        return await Blabla.findOne({ blablaId: blablaId });
      } catch (error: any) {
        throw new Error(`Failed to update blabla: ${error.message}`);
      }
    },
  },
};

export const blablaPermissions = shield({
  Query: {
    blablas: isAdmin,
  },
  Mutation: {
    addBlabla: isAdmin,
    updateBlabla: isAdmin,
  },
});
