import mongoose, { Schema } from 'mongoose';

const AdminSchema = new mongoose.Schema(
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
