import cron from 'node-cron';
import TemplatedRide from './models/templated_rides';
import Ride from './models/rides';
import logger from './logger/logger';
import Subscription from './models/subscription';
import { book } from './services/handlers';

const SubscriptionCronString = process.env.SubscriptionCronString || "0 0 * * *";

export function startSubscriptionCron() {
    cron.schedule(SubscriptionCronString, function () {
        logger.info("Subscription Cron Called");
        addBookings();
    });
}


export async function addBookings() {
    logger.info("Adding Bookings");
    const subs = await Subscription.find({ validUpto: { $gte: new Date() } });
    subs.forEach(async sub => {
        let templateRide = await TemplatedRide.findById(sub.templateRide)
        let date = getFormattedDate(1);
        let ride = await Ride.findOne({ from: templateRide?.from, to: templateRide?.to, departure_time: templateRide?.departure_time, date });
        if (!ride) return;
        await book(sub.phone!, sub.name!, 1, ride.ride_no! as unknown as string, 'bot', undefined, sub.exactPickup!);
    });
}

function getFormattedDate(i: number) {
    let date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000);
    return new Date(date.toISOString().split("T")[0]);
}