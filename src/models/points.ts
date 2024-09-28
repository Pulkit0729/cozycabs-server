import mongoose, { Document } from 'mongoose';
import { ILocation } from './templatedRides';

enum PointType {
  pickup = 'pickup',
  drop = 'drop',
}

export interface IPoint extends Document {
  pointId: string;
  location: ILocation;
  templateRideId: string;
  type: PointType;
  extraCost: number;
  distanceFromRoute: number;
  onRoute: boolean;
  label: string;
  landmark: string;
}

export const PointSchema = new mongoose.Schema<IPoint>({
  pointId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  location: Object,
  templateRideId: String,
  type: { type: String, enum: PointType },
  extraCost: Number,
  distanceFromRoute: Number,
  onRoute: Boolean,
  label: String,
  landmark: String,
});

const Point = mongoose.model('Points', PointSchema, 'points');
export default Point;
