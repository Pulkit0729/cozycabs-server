import { Request, Response } from 'express';
import { BookingService } from '../../../services/booking.service';
import { BookingChannel } from '../../../utils/constants';

export class BookingControlller {
  static async book(req: Request, res: Response) {
    const { user, rideId, userPromoId, seats } = req.body;
    const response = await BookingService.book(
      user,
      rideId,
      seats,
      BookingChannel.app,
      userPromoId
    );
    return res.json(response);
  }

  static async cancel(req: Request, res: Response) {
    const { user, bookingId } = req.body;
    const response = await BookingService.cancel(user, bookingId);
    return res.json(response);
  }
}
