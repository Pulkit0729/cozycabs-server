import { FilterQuery } from 'mongoose';
import Blabla, { IBlabla } from '../models/blabla';

export async function searchBlabla(filter: FilterQuery<IBlabla>) {
  return await Blabla.find(filter);
}
