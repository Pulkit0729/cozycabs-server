import mongoose from 'mongoose';
export interface IDeletedUser extends Document {
  userId: string;
  phone: string;
  reason: string;
  date: Date;
}
const DeletedUserSchema = new mongoose.Schema<IDeletedUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    phone: String,
    reason: String,
    date: Date,
  },
  { timestamps: true }
);

const DeletedUser = mongoose.model(
  'DeletedUsers',
  DeletedUserSchema,
  'deletedUsers'
);
export default DeletedUser;
