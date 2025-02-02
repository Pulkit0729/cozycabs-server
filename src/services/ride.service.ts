import { getBookingsFromRide } from '../dal/booking.dal';
import { getRide } from '../dal/ride.dal';
import { getRideTimeline } from '../dal/rideTimeline.dal';
import { updateUserPromo } from '../dal/userPromo.dal';
import { IRide } from '../models/rides';
import RideTimeline from '../models/rideTimeline';
import {
  BookingStatus,
  NavigationStatus,
  RideStatus,
} from '../utils/constants';
import { createRideStatusNotification } from '../utils/notifications';
import { sendNotification } from './external/firebase';
import { sendMessage, SendPulseEventTypes } from './external/sendpulse';
import { UserPromoService } from './userpromo.service';

export class RideService {
  static async updateRideStatus(rideId: string, status: RideStatus) {
    const ride = await getRide(rideId);
    if (!ride) throw new Error('Ride not found');
    ride.status = status;
    const bookings = await getBookingsFromRide(ride.rideId.toString());
    bookings.forEach(async (booking) => {
      switch (ride.status) {
        case RideStatus.cancelled:
          booking.isCancelled = true;
          booking.status = BookingStatus.cancelled;
          if (booking.promoId)
            await updateUserPromo(booking.promoId.toString(), {
              isUsed: false,
            });
          break;
        case RideStatus.ended:
          booking.status = BookingStatus.ended;
          await UserPromoService.handleReferralPromoAfterRide(booking);
          break;
        case RideStatus.active:
          booking.status = BookingStatus.active;
          break;
      }
      await booking.save();
    });

    ride.markModified('status');
    await ride.save();
    await this.updateRideStatusNotif(ride, bookings);
    await this.handleRideTimeline(rideId, status);
    return ride;
  }

  static async updateRideStatusNotif(ride: IRide, bookings: any[]) {
    const sendPulseEventType =
      ride.status == RideStatus.active
        ? SendPulseEventTypes.RIDESTART
        : ride.status == RideStatus.cancelled
          ? SendPulseEventTypes.RIDECANCEL
          : SendPulseEventTypes.RIDEEND;

    for (const booking of bookings) {
      const userFcm = booking.user.fcm?.value;
      if (userFcm) {
        const message = createRideStatusNotification(
          userFcm.toString(),
          ride as unknown as IRide
        );
        await sendNotification(message);
      }

      await sendMessage(
        sendPulseEventType,
        'user',
        booking.user,
        ride.driver,
        undefined,
        booking,
        booking.ride
      );
    }

    const driverFcm = ride.driver.fcm?.value;
    if (driverFcm) {
      const message = createRideStatusNotification(
        driverFcm.toString(),
        ride as unknown as IRide
      );
      await sendNotification(message);
    }
  }

  static async handleRideTimeline(
    rideId: string,
    navstatus: NavigationStatus | RideStatus
  ) {
    let rideTimeline = await getRideTimeline(rideId);
    if (!rideTimeline) {
      rideTimeline = new RideTimeline({
        rideId: rideId,
        history: [],
      });
    }
    const ride = await getRide(rideId);
    const history = JSON.parse(JSON.stringify(rideTimeline.history));

    history.push({
      status: navstatus,
      time: new Date(),
      location: ride?.driver.currentLocation,
    });
    rideTimeline.history = history;
    rideTimeline.markModified('history');
    await rideTimeline.save();
  }
}
