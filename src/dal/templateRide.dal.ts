import TemplatedRide, { TemplateRideStatus } from '../models/templatedRides';

export async function getUniqueFromToPlaces() {
  const from = await TemplatedRide.distinct('from', {
    status: TemplateRideStatus.ACTIVE,
  });
  const to = await TemplatedRide.distinct('to', {
    status: TemplateRideStatus.ACTIVE,
  });
  from.filter((f) => f != null);
  to.filter((t) => t != null);
  return { from, to };
}
