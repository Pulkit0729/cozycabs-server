import { FilterQuery } from 'mongoose';
import Point, { IPoint } from '../models/points';

export async function getPoint(pointId: string) {
  return await Point.findOne({ pointId: pointId }).then((point) => {
    return point;
  });
}
export async function searchPoint(filters: FilterQuery<IPoint>) {
  return await Point.findOne(filters).then((point) => {
    return point;
  });
}
