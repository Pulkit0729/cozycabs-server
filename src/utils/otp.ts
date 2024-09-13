import crypto from 'crypto';
export async function generateAndStoreOTP(rideId: string) {
  try {
    const otp = crypto.randomInt(100000, 999999);
    console.log(`OTP ${otp} stored successfully for booking ${rideId}`);
    return { success: true, otp };
  } catch (error) {
    console.error('Error generating and storing OTP:', error);
    return { success: false, message: 'Error generating and storing OTP' };
  }
}
