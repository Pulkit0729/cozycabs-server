import { Document, model, Schema } from 'mongoose';
import { NavigationStatus, RideStatus } from '../utils/constants';
import { ILocation } from './templatedRides';

export interface IHistory extends Document {
  status: NavigationStatus | RideStatus;
  time: Date;
  location?: ILocation;
}
export interface IRideTimeline extends Document {
  rideId: string;
  history: [IHistory];
}

export const HistoryInstaceSchema = new Schema({
  status: { type: String },
  time: Date,
  location: Object,
});

const RideTimelineSchema = new Schema<IRideTimeline>({
  rideId: String,
  history: [HistoryInstaceSchema],
});

const RideTimeline = model('RideTimeline', RideTimelineSchema, 'rideTimeline');
export default RideTimeline;
