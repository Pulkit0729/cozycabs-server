import cron from 'node-cron';
import TemplatedRide from './models/templatedRides';
import Ride from './models/rides';
import logger from './logger/logger';

const Cron_String = process.env.CRON_STRING || '0 0 * * *';

export function startCron() {
  cron.schedule(Cron_String, function () {
    logger.info('Cron Called');
    addRides();
  });
}

export async function addRides() {
  logger.info('Adding Rides');
  let noOfRides = 0;
  try {
    noOfRides = (await Ride.find().sort({ rideNo: -1 }).limit(1).exec())[0]
      .rideNo!;
    if (noOfRides == null) noOfRides = 0;
  } catch (_error) {}

  try {
    const templated_rides = await TemplatedRide.find().sort({ time: 1 }).exec();
    for (let i = 0; i < templated_rides.length; i++) {
      const templateRide = templated_rides[i];
      for (let index = 0; index < 3; index++) {
        const dateString = getFormattedDate(index);
        const existRide = await Ride.findOne({
          date: dateString,
          from: templateRide.from!,
          to: templateRide.to!,
          departureTime: templateRide.departureTime!,
          driver: templateRide.driver!,
        });
        if (!existRide) {
          noOfRides++;
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
            rideNo: noOfRides,
            driver: templateRide.driver,
            seats: templateRide.seats,
            price: templateRide.price,
            discountedPrice: templateRide.discountedPrice,
            status: 'pending',
          });
          await ride.save();
        }
      }
    }
  } catch (error) {
    logger.error(error);
  }
}

function getFormattedDate(i: number) {
  const date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000);
  return new Date(date.toISOString().split('T')[0]);
}
