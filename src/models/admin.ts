import mongoose, { Schema, Types } from 'mongoose';
export interface IAdmin extends Document {
  adminId: Types.ObjectId;
  name: string;
  phone: string;
  type: string;
}
const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
      unique: true,
    },
    name: String,
    phone: {
      type: String,
      unique: true,
    },
    type: String,
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admins', AdminSchema, 'admins');
export default Admin;
