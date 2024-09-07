import { FilterQuery } from 'mongoose';
import BookingPoint, { IBookingPoint } from '../models/bookingPoints';
import { IPoint } from '../models/points';

export async function getBookingPoint(bookingPointId: string) {
  return await BookingPoint.findOne({ bookingPointId: bookingPointId })
    .populate<{ pickup: IPoint }>('pickup')
    .populate<{ drop: IPoint }>('drop')
    .then((bookingPoint) => {
      return bookingPoint;
    });
}
export async function getBookingPointFromBooking(bookingId: string) {
  return await BookingPoint.findOne({ bookingId: bookingId })
    .populate<{ pickup: IPoint }>('pickup')
    .populate<{ drop: IPoint }>('drop')
    .then((bookingPoint) => {
      return bookingPoint;
    });
}
export async function searchBookingPoint(filters: FilterQuery<IBookingPoint>) {
  return await BookingPoint.findOne(filters)
    .populate<{ pickup: IPoint }>('pickup')
    .populate<{ drop: IPoint }>('drop')
    .then((bookingPoint) => {
      return bookingPoint;
    });
}
