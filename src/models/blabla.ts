import mongoose from 'mongoose';
export interface IBlabla extends Document {
  blablaId: string;
  rideId: string;
  price: number;
}
const BlablaSchema = new mongoose.Schema<IBlabla>(
  {
    blablaId: {
      type: String,
      required: true,
      unique: true,
    },
    rideId: {
      type: String,
      unique: true,
    },
    price: Number,
  },
  { timestamps: true }
);

const Blabla = mongoose.model('Blablas', BlablaSchema, 'blablas');
export default Blabla;
