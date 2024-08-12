import { Message } from 'firebase-admin/messaging';
import { IRide } from '../models/rides';
import { IUser } from '../models/users';
import { NavigationStatus } from './constants';

export const createRideStatusNotification = (fcm: string, ride: IRide) => {
  const notification = {
    body: `Your ride from ${ride.from} to ${ride.to} is ${ride.status}`,
    title: `Ride ${ride.status}`,
  };
  return createNotification(fcm, notification);
};
export const createRideNavStatusNotification = (
  fcm: string,
  ride: IRide,
  navstatus: string
) => {
  let notification;
  switch (navstatus) {
    case NavigationStatus.none:
      break;
    case NavigationStatus.goToPickup:
      notification = {
        body: `Please reach pick up location 5 min prior.`,
        title: `Drive on his way`,
      };
      break;
    case NavigationStatus.reachedPickup:
      notification = {
        body: `Your driver is waiting at the pickup location`,
        title: `Driver Arrived`,
      };
      break;
    case NavigationStatus.goToDrop:
      notification = {
        body: `Your ride from ${ride.from} to ${ride.to} is stated`,
        title: `Ride ${ride.status}`,
      };
      break;
    case NavigationStatus.reachedDrop:
      notification = {
        body: `Your have reached the end of the ride`,
        title: `Ride ${ride.status}`,
      };
      break;
    default:
      return;
  }

  return createNotification(fcm, notification);
};

export const passengerAddedNotification = (
  fcm: string,
  ride: IRide,
  user: IUser
) => {
  const notification = {
    body: `${user.name} booked for ${ride.from} to ${ride.to}`,
    title: `New Passenger`,
  };
  return createNotification(fcm, notification);
};

export const passengerCancelledNotification = (
  fcm: string,
  ride: IRide,
  user: IUser
) => {
  const notification = {
    body: `${user.name} cancelled for ${ride.from} to ${ride.to}`,
    title: `Passenger Cancelled`,
  };
  return createNotification(fcm, notification);
};

export const createNotification = (fcm: string, notification: any) => {
  const message: Message = {
    notification: notification,
    android: {
      priority: 'high',
    },
    apns: {
      headers: {
        'apns-priority': '5',
      },
    },
    webpush: {
      headers: {
        Urgency: 'high',
      },
    },
    token: fcm,
  };
  return message;
};
