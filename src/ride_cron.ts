import cron from "node-cron";
import TemplatedRide, { TemplateStatus } from "./models/templated_rides";
import Ride from "./models/rides";
import logger from "./logger/logger";

const Cron_String = process.env.CRON_STRING || "0 0 * * *";

export function startCron() {
  cron.schedule(Cron_String, function () {
    logger.info("Cron Called");
    addRides();
  });
}

export async function addRides() {
  logger.info("Adding Rides");
  let noOfRides = 1;
  try {
    noOfRides = (await Ride.find().sort({ ride_no: -1 }).limit(1).exec())[0]
      .ride_no!;
  } catch (error) {}

  let templated_rides = await TemplatedRide.find({
    status: TemplateStatus.ACTIVE,
  })
    .sort({ time: 1 })
    .exec();
  templated_rides.sort((tr1, tr2) => {
    const a = new Date("1970/01/01 " + tr1.departure_time).valueOf();
    const b = new Date("1970/01/01 " + tr2.departure_time).valueOf();
    return a - b;
  });
  templated_rides.forEach(async (templateRide) => {
    for (let index = 0; index < 3; index++) {
      let dateString = getFormattedDate(index);
      let existRide = await Ride.findOne({
        date: dateString,
        from: templateRide.from,
        to: templateRide.to,
        departure_time: templateRide.departure_time,
        driver_no: templateRide.driver_no,
      });
      if (!existRide) {
        noOfRides++;
        let ride = new Ride({
          from: templateRide.from,
          to: templateRide.to,
          from_address: templateRide.from_address,
          to_address: templateRide.to_address,
          date: dateString,
          departure_time: templateRide.departure_time,
          arrival_time: templateRide.arrival_time,
          ride_no: noOfRides,
          driver_no: templateRide.driver_no,
          driver_name: templateRide.driver_name,
          seats: templateRide.seats,
          price: templateRide.price,
          discounted_price: templateRide.discounted_price,
          status: "pending",
          notification_sent: false,
        });
        await ride.save();
      }
    }
  });
}

function getFormattedDate(i: number) {
  let date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000);
  return new Date(date.toISOString().split("T")[0]);
}
