import { BookingStatus } from './constants';
import { getBookingsFromRide } from '../dal/booking.dal';

async function verifybydriver(rideId: string, otp: number) {
  try {
    const bookings = await getBookingsFromRide(rideId);
    if (!bookings) {
      return { success: false, message: 'Booking not found' };
    }

    const booking = bookings[0];

    console.log(rideId, booking.rideId.toString());

    if (rideId !== booking.rideId.toString()) {
      return {
        success: false,
        message: 'ride id doesnt match',
      };
    }

    if (!booking.otp) {
      return {
        success: false,
        message: 'OTP not available for this booking',
      };
    }

    if (Number(booking.otp) !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    booking.status = BookingStatus.pickedup;
    await booking.save();

    console.log(`Booking status updated to: ${booking.status}`);
    return { success: true, message: 'OTP verification successful' };
  } catch (error: any) {
    console.error('Error verifying OTP:', error.message);
    return { success: false, message: 'Internal server error' };
  }
}

export { verifybydriver };
