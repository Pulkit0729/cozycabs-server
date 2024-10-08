import { Request, Response } from 'express';
import { getBooking } from '../../../dal/booking.dal';
import Review from '../../../models/review';
import logger from '../../../logger/logger';

export class ReviewController {
  static async addReview(req: Request, res: Response) {
    const { user, bookingId, rating, review } = req.body;
    try {
      if (!rating) throw new Error('Invalid Rating');
      const booking = await getBooking(bookingId);
      if (!booking) throw new Error('Booking not found');

      if (booking.userId.toString() != user.userId.toString())
        throw new Error('User is not allowed to add review');

      const r = new Review({
        bookingId: bookingId,
        rideId: booking.rideId,
        driverId: booking.ride.driverId,
        userId: user.userId,
        rating: rating,
        review: review,
      });

      await r.save();
      return res.json({ success: true, data: { review: r } });
    } catch (error: any) {
      logger.error(error.message);
      return res.json({ success: false, message: error.message });
    }
  }
}
