import mongoose, { Mongoose, Types } from "mongoose";

export enum TemplateStatus {
  ACTIVE = "active",
  PAUSE = "pause",
}

const TemplatedRideSchema = new mongoose.Schema({
  from: String,
  to: String,
  from_address: String,
  to_address: String,
  time: String,
  arrival_time: String,
  departure_time: String,
  driver_no: String,
  driver_name: String,
  seats: Number,
  price: Number,
  status: { type: String, enum: TemplateStatus },
  discounted_price: Number,
});

const TemplatedRide = mongoose.model(
  "TemplatedRides",
  TemplatedRideSchema,
  "templatedRides"
);
export default TemplatedRide;
