import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
  {
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
