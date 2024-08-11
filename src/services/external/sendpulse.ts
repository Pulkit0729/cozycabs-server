import { IBooking } from '../../models/bookings';
import { IDriver } from '../../models/drivers';
import { IRide } from '../../models/rides';
import { IUser } from '../../models/users';

const axios = require('axios').create();
const sendpulseUrl =
  'https://events.sendpulse.com/events/id/e7f2456215644ca2ffbc925ab367cdf8/8582829';

export async function makeRequest(
  url: string,
  method: any,
  body: any,
  headers: any
) {
  return axios[method]((url = url), body, { headers });
}
export const eventType = {
  ride_start: 'ride_start',
  ride_end: 'ride_end',
  book: 'book',
  error: 'error',
  cancel: 'cancel',
};
export const sendToUser = async (
  event: string,
  booking: IBooking,
  ride: IRide,
  user: IUser,
  driver: IDriver,
  locationUrl?: any
) => {
  const date = ride.date.split('T')[0];
  await makeRequest(
    sendpulseUrl,
    'post',
    {
      phone: user.phone,
      name: user.name,
      type: 'user',
      event_type: event,
      from: ride.from,
      to: ride.to,
      date: date,
      seats: booking.seats,
      departureTime: ride.departureTime,
      arrivalTime: ride.arrivalTime,
      price: booking.discountedTotal,
      driver_no: driver.phone,
      carName: driver?.carName,
      carNo: driver?.carNo,
      locationUrl: locationUrl,
      is_active: Date.now(),
    },
    { 'Content-Type': 'application/json' }
  );
};
export const sendToDriver = async (
  event: string,
  booking: IBooking,
  ride: IRide,
  user: IUser,
  driver: IDriver,
  driver_name?: any
) => {
  const date = ride.date.split('T')[0];
  await makeRequest(
    sendpulseUrl,
    'post',
    {
      phone: driver.phone,
      driver_name: driver_name,
      type: 'driver',
      event_type: event,
      from: ride.from,
      to: ride.to,
      date: date,
      price: booking.discountedTotal,
      seats: booking.seats,
      departureTime: ride.departureTime,
      arrivalTime: ride.arrivalTime,
      user_phone: user.phone,
      name: user.name,
      is_active: Date.now(),
    },
    { 'Content-Type': 'application/json' }
  );
};

export const sendError = async (event: string, phone: string) => {
  await makeRequest(
    sendpulseUrl,
    'post',
    {
      phone: phone,
      type: 'user',
      event_type: event,
      is_active: Date.now(),
    },
    { 'Content-Type': 'application/json' }
  );
};

export const sendToAdmin = async (
  event: string,
  booking: IBooking,
  ride: IRide,
  user: IUser,
  no: any
) => {
  const date = ride.date.split('T')[0];

  await makeRequest(
    sendpulseUrl,
    'post',
    {
      phone: no,
      type: 'driver',
      event_type: event,
      from: ride.from,
      to: ride.to,
      date: date,
      seats: booking.seats,
      price: booking.discountedTotal,
      departureTime: ride.departureTime,
      arrivalTime: ride.arrivalTime,
      user_phone: user.phone,
      name: user.name,
      is_active: Date.now(),
    },
    { 'Content-Type': 'application/json' }
  );
};
