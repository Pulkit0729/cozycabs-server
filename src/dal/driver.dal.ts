import Driver from '../models/drivers';

export async function getDriver(driverId: string) {
  return await Driver.findOne({ driverId: driverId }).then((driver) => {
    return driver;
  });
}
export async function getDriverFromApiKey(apiKey: string) {
  return await Driver.findOne({ apiKey: apiKey }).then((driver) => {
    return driver;
  });
}

export async function getDriverFromEmail(email: string) {
  return await Driver.findOne({ email: email }).then((driver) => {
    return driver;
  });
}

export async function getDriverFromPhone(phone: string) {
  return await Driver.findOne({ phone: phone }).then((driver) => {
    return driver;
  });
}
