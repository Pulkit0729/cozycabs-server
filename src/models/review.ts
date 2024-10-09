import mongoose, { Document } from 'mongoose';

export interface IReview extends Document {
  reviewId: string;
  bookingId: string;
  rideId: string;
  driverId: string;
  userId: string;
  rating: number;
  review: string;
}

export const ReviewSchema = new mongoose.Schema<IReview>({
  reviewId: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  bookingId: { type: String, unique: true },
  rideId: String,
  driverId: String,
  userId: String,
  rating: String,
  review: String,
});

const Review = mongoose.model('Reviews', ReviewSchema, 'reviews');
export default Review;
