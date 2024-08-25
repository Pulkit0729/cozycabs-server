import TemplatedRide from '../models/templatedRides';

export async function getUniqueFromToPlaces() {
  const from = await TemplatedRide.distinct('from');
  const to = await TemplatedRide.distinct('to');
  from.filter((f) => f != null);
  to.filter((t) => t != null);
  return { from, to };
}
