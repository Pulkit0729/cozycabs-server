import mongoose from 'mongoose';
export interface IBlabla extends Document {
  blablaId: string;
  rideId: string;
}
const BlablaSchema = new mongoose.Schema<IBlabla>(
  {
    blablaId: {
      type: String,
      required: true,
      unique: true,
    },
    rideId: String,
  },
  { timestamps: true }
);

const Blabla = mongoose.model('Blablas', BlablaSchema, 'blablas');
export default Blabla;
