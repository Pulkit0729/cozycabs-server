import Config from '../models/config';

export async function getConfigFromKey(key: string) {
  return await Config.find({ key: key });
}
