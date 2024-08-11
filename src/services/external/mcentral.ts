import axios from 'axios';
import logger from '../../logger/logger';

const url = 'https://cpaas.messagecentral.com';
const customerId = process.env.MCENTRAL_CUSTOMER_ID;
const mCentralEmail = process.env.MCENTRAL_EMAIL;
const mCentralPassword = process.env.MCENTRAL_PASSWORD;
let accessToken = '';

export async function refreshAccessToken(): Promise<string> {
  const res = await axios.get(
    `${url}/auth/v1/authentication/token?customerId=${customerId}&country=IN&Email=${mCentralEmail}&key=${mCentralPassword}&scope=NEW`
  );
  return res.data.token;
}

export async function sendOTP(phone: number, value = 0) {
  if (value === 2) return false;
  try {
    const res = await axios.post(
      `${url}/verification/v2/verification/send?customerId=${customerId}&countryCode=91&otpLength=4&mobilenumber=${phone}&flowType=SMS`,
      {},
      { headers: { authToken: accessToken } }
    );
    if (res.data.responseCode === 401 && value == 0) {
      throw new Error(`Error sending OTP: ${res.data.responseCode}`);
    }
    return res.data.responseCode == 200 ? res.data.data.verificationId : false;
  } catch (error) {
    logger.error(`Error sending OTP: ${error}`);
    accessToken = await refreshAccessToken();
    return await sendOTP(phone, value + 1);
  }
}

export async function verifyOTP(vId: number, code: number, value = 0) {
  if (value === 2) return false;
  try {
    const config = {
      url: `${url}/verification/v2/verification/validateOtp?customerId=${customerId}&verificationId=${vId}&code=${code}`,
      headers: {
        authToken: accessToken,
      },
    };
    const res = await axios.request(config);
    if (res.data.responseCode === 401 && value == 0) {
      throw new Error(`Error Verifying OTP: ${res.data.responseCode}`);
    }
    return res.data.responseCode == 200;
  } catch (error) {
    logger.error(`Error verifying OTP: ${error}`);
    accessToken = await refreshAccessToken();
    return await verifyOTP(vId, code, value + 1);
  }
}
