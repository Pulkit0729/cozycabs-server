import cron from 'node-cron';
import TemplatedRide from './models/templated_rides';
import Ride from './models/rides';
import logger from './logger/logger';

const Cron_String = process.env.CRON_STRING || "0 0 */3 * *";

export function startCron() {
    cron.schedule(Cron_String, function () {
        logger.info("Cron Called");
        addRides();
    });
}


async function addRides() {

    let noOfRides = await Ride.countDocuments();

    let templated_rides = await TemplatedRide.find();
    templated_rides.forEach(async (templateRide, i) => {
        for (let index = 0; index < 3; index++) {
            let dateString = getFormattedDate(index);
            let ride = new Ride({
                from: templateRide.from,
                to: templateRide.to,
                date: dateString,
                time: templateRide.time,
                ride_no: noOfRides + 1 + i*3+index,
                driver_no: templateRide.driver_no,
                driver_name: templateRide.driver_name,
                seats: templateRide.seats,
                price: templateRide.price,
                status: "pending",
            });
            await ride.save();
        }

    });
}

function getFormattedDate(i: number) {
    let date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000);
    let day = Number(date.getDate()).toString();
    let month = Number(date.getMonth()).toString();
    let year = Number(date.getFullYear()).toString();

    let dateString = (day.length == 1 ? "0" + day : day) + "." + (month.length == 1 ? "0" + month : month) + "." + year;
    return dateString;
}