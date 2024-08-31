import gql from 'graphql-tag';
import Admin from '../models/admin';
import { constructQuery } from '../utils/apollo.util';
import { isAdmin } from '../utils/permission.util';
import { shield } from 'graphql-shield';

export const adminTypeDefs = gql`
  type Admin {
    adminId: String
    name: String
    phone: String
    type: String
  }

  input AdminInput {
    name: String
    phone: String
    type: String
  }
  input AdminUpdateInput {
    name: String
    phone: String
    type: String
  }
  input AdminFilter {
    adminId: String
    name: String
    phone: String
    type: String
  }
`;

export const adminResolvers = {
  Query: {
    admins: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      const { query, sortOptions } = constructQuery(
        filterBy,
        sortBy,
        sortOrder
      );
      const admins = await Admin.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return admins;
    },
  },
  Mutation: {
    addAdmin: (_: any, { input }: any) => {
      const newUser = new Admin(input);
      return newUser.save();
    },
    updateAdmin: async (_: any, { adminId, input }: any) => {
      try {
        const admin = await Admin.findOne({ adminId });
        if (!admin) {
          throw new Error('Admin not found');
        }
        // Update admin properties if provided in the input
        await admin.updateOne({ ...input });

        return await Admin.findOne({ adminId });
      } catch (error: any) {
        throw new Error(`Failed to update admin: ${error.message}`);
      }
    },
  },
};

export const adminPermissions = shield({
  Query: {
    admins: isAdmin,
  },
  Mutation: {
    addAdmin: isAdmin,
    updateAdmin: isAdmin,
  },
});
