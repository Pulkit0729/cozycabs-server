import cron from 'node-cron';
import TemplatedRide, { TemplateRideStatus } from './models/templatedRides';
import Ride from './models/rides';
import logger from './logger/logger';
import { getFormattedDate } from './utils/date.util';
import { RideStatus } from './utils/constants';

const Cron_String = process.env.CRON_STRING || '0 0 * * *';

export function startCron() {
  cron.schedule(Cron_String, function () {
    logger.info('Cron Called');
    addRides();
  });
}

export async function addRides() {
  logger.info('Adding Rides');
  try {
    const templated_rides = await TemplatedRide.find({
      status: TemplateRideStatus.ACTIVE,
    })
      .sort({ time: 1 })
      .exec();
    for (let i = 0; i < templated_rides.length; i++) {
      const templateRide = templated_rides[i];
      for (let index = 0; index < 3; index++) {
        const dateString = getFormattedDate(index);
        const existRide = await Ride.findOne({
          date: dateString,
          from: templateRide.from!,
          to: templateRide.to!,
          departureTime: templateRide.departureTime!,
          driverId: templateRide.driverId!,
        });
        if (!existRide) {
          const ride = new Ride({
            from: templateRide.from,
            to: templateRide.to,
            fromAddress: templateRide.fromAddress,
            toAddress: templateRide.toAddress,
            fromLocation: templateRide.fromLocation,
            toLocation: templateRide.toLocation,
            date: dateString,
            departureTime: templateRide.departureTime,
            arrivalTime: templateRide.arrivalTime,
            driverId: templateRide.driverId,
            seats: templateRide.seats,
            price: templateRide.price,
            discountedPrice: templateRide.discountedPrice,
            status: RideStatus.pending,
          });
          await ride.save();
        }
      }
    }
  } catch (error: any) {
    logger.error(error.message);
  }
}
