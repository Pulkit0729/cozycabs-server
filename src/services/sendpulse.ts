const axios = require("axios").create();
const sendpulseUrl = 'https://events.sendpulse.com/events/id/e7f2456215644ca2ffbc925ab367cdf8/8582829';

export async function makeRequest(url: String, method: any, body: any, headers: any) {
  return axios[method]((url = url), body, { headers });
}
export const eventType = {
  "ride_start": "ride_start",
  "ride_end": "ride_end",
  "book": "book",
  "cancel": "cancel"
}
export const sendToUser = async (event: string, booking: {
  date: any;
  seats: any;
  departure_time: any;
  arrival_time: any;
  total: any;
  discounted_total: any;
  driver_no: any;
  user_no: any,
  user_name: any,
  from: any,
  to: any,
},
  driver?: {
    car_name: string,
    car_no: string
  },
  location_url?: any) => {
  await makeRequest(sendpulseUrl, "post", {
    phone: booking.user_no,
    name: booking.user_name,
    type: 'user',
    event_type: event,
    from: booking.from,
    to: booking.to,
    date: booking.date,
    seats: booking.seats,
    departure_time: booking.departure_time,
    arrival_time: booking.arrival_time,
    price: booking.discounted_total,
    driver_no: booking.driver_no,
    car_name: driver?.car_name,
    car_no: driver?.car_no,
    location_url: location_url,
    is_active: Date.now()
  },
    { "Content-Type": "application/json" }
  )
}
export const sendToDriver = async (event: string, booking: {
  date: any;
  seats: any;
  departure_time: any,
  arrival_time: any,
  total: any;
  driver_no: any; user_no: any, user_name: any, from: any, to: any
}, driver_name?: any) => {
  await makeRequest(sendpulseUrl, "post", {
    phone: booking.driver_no,
    driver_name: driver_name,
    type: 'driver',
    event_type: event,
    from: booking.from,
    to: booking.to,
    date: booking.date,
    seats: booking.seats,
    departure_time: booking.departure_time,
    arrival_time: booking.arrival_time,
    user_phone: booking.user_no,
    name: booking.user_name,
    is_active: Date.now()
  },
    { "Content-Type": "application/json" }
  )
}