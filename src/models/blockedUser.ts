import mongoose from 'mongoose';
export interface IBlockedUser extends Document {
  userId: string;
  isBlocked: boolean;
  reason: string;
  date: Date;
}
const BlockedUserSchema = new mongoose.Schema<IBlockedUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    isBlocked: Boolean,
    reason: {
      type: String,
      unique: true,
    },
    date: Date,
  },
  { timestamps: true }
);

const BlockedUser = mongoose.model(
  'BlockedUsers',
  BlockedUserSchema,
  'blockedUsers'
);
export default BlockedUser;
