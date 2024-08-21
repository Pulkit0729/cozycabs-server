import { IAdmin } from '../../models/admin';
import { IBooking } from '../../models/bookings';
import { IDriver } from '../../models/drivers';
import { IRide } from '../../models/rides';
import { IUser } from '../../models/users';

const axios = require('axios').create();
const sendpulseUrl =
  'https://events.sendpulse.com/events/id/26c3cacd66274c4fdb88714f03327e5f/8582829';

export async function makeRequest(
  url: string,
  method: any,
  body: ISendpulsePostBody,
  headers: any
) {
  return axios[method]((url = url), body, { headers });
}
export enum SendPulseEventTypes {
  RIDESTART = 'rideStart',
  RIDEEND = 'rideEnd',
  RIDECANCEL = 'rideCancel',
  BOOK = 'book',
  ERROR = 'error',
  CANCEL = 'cancel',
}
export interface ISendpulsePostBody {
  phone: string;
  username: string;
  userPhone: string;
  fromAddress?: string;
  toAddress?: string;
  date?: string;
  seats?: string;
  driverName?: string;
  grandTotal?: string;
  rideId?: string;
  departureTime?: string;
  carNo?: string;
  carName?: string;
  arrivalTime?: string;
  eventType: string;
  errorMessage?: string | undefined;
  userType: string;
  timestamp: string;
  driverPhone?: string;
}
export const sendMessage = async (
  event: string,
  userType: string,
  user: IUser,
  driver?: IDriver,
  admin?: IAdmin,
  booking?: IBooking,
  ride?: IRide
) => {
  const date = ride?.date.toISOString().split('T')[0];
  await makeRequest(
    sendpulseUrl,
    'post',
    {
      phone:
        userType == 'user'
          ? user.phone
          : userType == 'admin'
            ? admin!.phone
            : driver!.phone,
      username: user.name,
      userPhone: user.phone,
      fromAddress: ride?.fromAddress,
      toAddress: ride?.toAddress,
      date: date,
      seats: ride?.seats.toString(),
      rideId: ride?.rideId.toString(),
      departureTime: ride?.departureTime,
      arrivalTime: ride?.arrivalTime,
      grandTotal: booking?.billDetails.grandTotal.toString(),
      driverName: driver?.name,
      driverPhone: driver?.phone,
      carNo: driver?.carNo,
      carName: driver?.carName,
      eventType: event,
      userType: userType,
      timestamp: Date.now().toString(),
    },
    {
      'Content-Type': 'application/json',
    }
  );
};
