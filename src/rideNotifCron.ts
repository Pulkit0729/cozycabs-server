import cron from "node-cron";
import Ride from "./models/rides";
import logger from "./logger/logger";
import Booking from "./models/bookings";
import { eventType, sendToUser } from "./services/sendpulse";

const Cron_String = "*/30 * * * *";
const timeDiff = 180;

export function startRideNotifCron() {
  cron.schedule(Cron_String, function () {
    logger.info("Ride Notif Cron Called");
    rideNotifHandler();
  });
}

export async function rideNotifHandler() {
  logger.info("Ride Notif");
  let today = getFormattedDate(1);
  let now = new Date();
  let todayRides = await Ride.find({ date: today, notification_sent: false });
  for (let i = 0; i < todayRides.length; i++) {
    let rideTime24 = convertTo24Hour(todayRides[i].departure_time!);
    let [rideHours, rideMinutes] = rideTime24.split(":").map(Number);
    let rideTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      rideHours,
      rideMinutes
    );
    let timeDifferenceMs = rideTime.valueOf() - now.valueOf();
    let differenceInMinutes = Math.floor(timeDifferenceMs / (1000 * 60));
    if (differenceInMinutes < timeDiff) {
      let bookings = await Booking.find({
        ride_id: todayRides[i].id,
        is_cancelled: false,
      });
      bookings.forEach(async (booking) => {
        logger.info("Ride Notif " + booking.user_no);

        let des = await sendToUser(
          eventType.rideNotif,
          JSON.parse(JSON.stringify(booking))
        );
      });
    }
    todayRides[i].notification_sent = true;
    todayRides[i].markModified("notification_sent");
    await todayRides[i].save();
  }

  // Convert the difference to hours and minutes
}

function getFormattedDate(i: number) {
  let date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000);
  return new Date(date.toISOString().split("T")[0]);
}

// Function to convert 12-hour format to 24-hour format
function convertTo24Hour(timeStr: String) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  return `${hours.padStart(2, "0")}:${minutes}`;
}
