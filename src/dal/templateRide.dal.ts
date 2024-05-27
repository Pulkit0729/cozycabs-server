import TemplatedRide from "../models/templated_rides";

export async function getUniqueFromToPlaces() {
    const from = await TemplatedRide.distinct('from');
    const to = await TemplatedRide.distinct('to');
    return { from, to }
}