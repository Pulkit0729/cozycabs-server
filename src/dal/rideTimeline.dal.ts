import RideTimeline from '../models/rideTimeline';

export async function getRideTimeline(rideId: string) {
  return await RideTimeline.findOne({ rideId: rideId }).then((rT) => {
    return rT;
  });
}
