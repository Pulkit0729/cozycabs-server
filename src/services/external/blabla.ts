import { parse } from 'node-html-parser';
import logger from '../../logger/logger';
import User, { IUser } from '../../models/users';
import { getUser, getUserFromPhone } from '../../dal/user.dal';
import Blabla from '../../models/blabla';
import { BookingService } from '../booking.service';
import { BookingChannel } from '../../utils/constants';
import {
  getBooking,
  searchBookingsFromRideFilters,
} from '../../dal/booking.dal';
import { sendMessage, SendPulseEventTypes } from './sendpulse';
import Admin from '../../models/admin';
import { getRide } from '../../dal/ride.dal';
import { IRide } from '../../models/rides';

export default class BlablaService {
  static async handleBlabla(subject: string, message: string) {
    let name, blablaId: string | undefined, seats, userPhone;

    const root = parse(message);
    root.getElementsByTagName('a').forEach((element) => {
      if (
        element.hasAttribute('href') &&
        element.getAttribute('href')?.includes('id=')
      ) {
        const url = element.getAttribute('href');
        blablaId = url?.split('id=')[1].slice(0, 36);
      }
    });
    root.getElementsByTagName('h1').forEach((element) => {
      name = element.innerHTML.replace('\n', '').trim().split(' ')[0];
    });

    switch (true) {
      case subject.includes('Passenger accepted for'):
        root.getElementsByTagName('a').forEach((element) => {
          if (
            element.hasAttribute('href') &&
            element.getAttribute('href')?.includes('tel')
          ) {
            const url = element.getAttribute('href');
            logger.log('info', 'url: ' + url);
            userPhone =
              '91' +
              url
                ?.split(':')[1]
                .replace(/%20/g, '')
                .replace(/ /g, '')
                .slice(-10);
          }
        });
        root.getElementsByTagName('p').forEach((element) => {
          if (element.innerText.includes('seat')) {
            seats = element.innerHTML.replace('\n', '').trim().split(' ')[0];
          }
        });
        if (userPhone && name && seats && blablaId) {
          await this.bookFromBlabla(userPhone, name, seats, blablaId);
        } else {
          logger.log({
            level: 'error',
            message: 'User phone, name seats required:' + userPhone,
            name,
            seats,
          });
        }
        break;
      case subject.includes('New passenger for'):
        root.getElementsByTagName('a').forEach((element) => {
          if (
            element.hasAttribute('href') &&
            element.getAttribute('href')?.includes('tel')
          ) {
            const url = element.getAttribute('href');
            logger.log('info', 'url: ' + url);
            userPhone =
              '91' +
              url
                ?.split(':')[1]
                .replace(/%20/g, '')
                .replace(/ /g, '')
                .slice(-10);
          }
        });
        root.getElementsByTagName('p').forEach((element) => {
          if (element.innerText.includes('seat')) {
            seats = element.innerHTML.replace('\n', '').trim().split(' ')[0];
          }
        });
        if (userPhone && name && seats && blablaId) {
          await this.bookFromBlabla(userPhone, name, seats, blablaId);
        } else {
          logger.log({
            level: 'error',
            message: 'User phone, name seats required:' + userPhone,
            name,
            seats,
          });
        }
        break;
      case subject.includes('Cancellation for'):
        if (name && blablaId) {
          await this.cancelFromBlabla(name, blablaId);
        }
        break;

      default:
        break;
    }
    logger.log({
      level: 'info',
      message: name! + blablaId! + seats + userPhone,
    });
  }

  static async bookFromBlabla(
    userPhone: string,
    userName: string,
    seats: any,
    blablaId: string
  ) {
    try {
      userPhone = userPhone.replace(/ /g, '');
      userPhone = '91' + userPhone.substr(userPhone.length - 10);
      let user = await getUserFromPhone(userPhone);
      if (!user) {
        user = new User({ phone: userPhone, name: userName ?? 'Unknown' });
        await user.save();
      }

      const blabla = await Blabla.findOne({ blablaId: blablaId });
      if (!blabla) throw new Error('No Blabla ride found');
      const ride = await getRide(blabla.rideId);
      if (!ride) throw new Error(`Ride ${blabla.rideId} does not exist`);
      if (ride.seats < seats) {
        await this.bookingWhenNoSeats(ride, user);
        return;
      }
      const response = await BookingService.book(
        user,
        blabla.rideId,
        seats,
        BookingChannel.blabla
      );
      if (response.success && response.booking) {
        const booking = await getBooking(
          response.booking?.bookingId.toString()
        );
        if (booking) {
          await sendMessage(
            SendPulseEventTypes.BOOK,
            'user',
            user,
            booking?.ride.driver,
            undefined,
            booking,
            booking?.ride
          );
          const admins = await Admin.find();
          for (const admin of admins) {
            await sendMessage(
              SendPulseEventTypes.BOOK,
              'admin',
              user,
              booking?.ride.driver,
              admin,
              booking,
              booking?.ride
            );
          }
        }
      } else {
        await sendMessage(SendPulseEventTypes.ERROR, 'user', user);
      }
      return;
    } catch (error) {
      logger.log({
        level: 'error',
        message: 'Error in booking:' + error,
      });
      return;
    }
  }

  static async cancelFromBlabla(userName: string, blablaId: string) {
    try {
      const blabla = await Blabla.findOne({ blablaId: blablaId });
      if (!blabla) throw new Error('No Blabla ride found');
      const bookings = await searchBookingsFromRideFilters(
        {
          'user.name': { $regex: userName, $options: 'i' },
          channel: BookingChannel.blabla,
        },
        { 'ride.date': -1 }
      );
      const user = await getUser(bookings[0].userId.toString());
      if (!user) throw new Error('No user found');
      if (!bookings || bookings.length == 0)
        throw new Error('No booking found');
      const response = await BookingService.cancel(
        user,
        bookings[0].bookingId.toString()
      );
      if (response.success && response.data) {
        const booking = await getBooking(response.data?.bookingId.toString());
        if (booking) {
          await sendMessage(
            SendPulseEventTypes.CANCEL,
            'user',
            user,
            booking?.ride.driver,
            undefined,
            booking,
            booking?.ride
          );
          const admins = await Admin.find();
          for (const admin of admins) {
            await sendMessage(
              SendPulseEventTypes.CANCEL,
              'admin',
              user,
              booking?.ride.driver,
              admin,
              booking,
              booking?.ride
            );
          }
        }
      }
      return;
    } catch (error) {
      logger.log({
        level: 'error',
        message: 'Error in cancelling:' + error,
      });
      return;
    }
  }

  static async bookingWhenNoSeats(ride: IRide, user: IUser) {
    await sendMessage(SendPulseEventTypes.BLABLASEATSERROR, 'user', user);
    const admins = await Admin.find();
    for (const admin of admins) {
      await sendMessage(
        SendPulseEventTypes.BLABLASEATSERROR,
        'admin',
        user,
        undefined,
        admin,
        undefined,
        ride
      );
    }
  }
}
