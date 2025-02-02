export enum NodeEnv {
  development = 'development',
  production = 'production',
}

export enum flowTypes {
  login = 'login',
  createUser = 'createUser',
}

export enum RideStatus {
  pending = 'pending',
  active = 'active',
  ended = 'ended',
  cancelled = 'cancelled',
}

export enum BookingStatus {
  pending = 'pending',
  active = 'active',
  ended = 'ended',
  cancelled = 'cancelled',
}

export enum BookingChannel {
  app = 'app',
  bot = 'bot',
  admin = 'admin',
  blabla = 'blabla',
}

export enum NavigationStatus {
  goToPickup = 'goToPickup',
  goToDrop = 'goToDrop',
  none = 'none',
  reachedPickup = 'reachedPickup',
  reachedDrop = 'reachedDrop',
}

export const rideStatusConfigKey = 'rideStatusConfigKey';
export const maxNoOfReferral = 30;
