import { Document, model, Schema } from 'mongoose';
import { NavigationStatus, RideStatus } from '../utils/constants';

export interface IRideTimeline extends Document {
  rideId: string;
  history: [{ status: NavigationStatus | RideStatus; time: Date }];
}

const HistoryInstaceSchema = new Schema({
  status: { type: String },
  time: Date,
});

const RideTimelineSchema = new Schema<IRideTimeline>({
  rideId: String,
  history: [HistoryInstaceSchema],
});

const RideTimeline = model('RideTimeline', RideTimelineSchema, 'rideTimeline');
export default RideTimeline;
