import gql from 'graphql-tag';
import Screen from '../../models/ui/screen';
import { constructQuery } from '../../utils/apollo.util';
import logger from '../../logger/logger';

export const screenTypeDefs = gql`
  enum ScreenType {
    Screen
    Modal
    BottomSheet
  }

  type Screen {
    screenId: String
    name: String!
    type: ScreenType!
    title: String
    head: Layout
    body: Layout
    bottom: Layout
  }

  input ScreenInput {
    name: String!
    type: ScreenType!
    title: String
    head: LayoutInput
    body: LayoutInput
    bottom: LayoutInput
  }
  input ScreenUpdateInput {
    name: String
    type: ScreenType
    title: String
    head: LayoutUpdateInput
    body: LayoutUpdateInput
    bottom: LayoutUpdateInput
  }
  input ScreenFilter {
    AND: [ScreenFilter]
    OR: [ScreenFilter]
    screenId: String
    name: String
    type: ScreenType
    title: String
  }
`;

export const screenResolvers = {
  Query: {
    screens: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const screens = await Screen.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return screens;
    },
  },
  Mutation: {
    addScreen: async (_: any, { input }: any) => {
      try {
        const newUser = new Screen(input);
        return await newUser.save();
      } catch (error: any) {
        logger.error(error);
        return;
      }
    },
    updateScreen: async (_: any, { screenId, input }: any) => {
      try {
        const screen = await Screen.findOne({ screenId });
        if (!screen) {
          throw new Error('Screen not found');
        }
        // Update screen properties if provided in the input
        await screen.updateOne({ ...input });

        return await Screen.findOne({ screenId });
      } catch (error: any) {
        throw new Error(`Failed to update screen: ${error.message}`);
      }
    },
  },
};
