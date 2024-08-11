import mongoose from 'mongoose';

export interface ILocation {
  type: string;
  coordinates: any[];
}
export interface ITemplateRide {
  id: string;
  from: string;
  fromLocation: ILocation;
  to: string;
  toLocation: ILocation;
  fromAddress: string;
  toAddress: string;
  time: string;
  arrivalTime: string;
  departureTime: string;
  driver: string;
  seats: number;
  price: number;
  discountedPrice: number;
}

const TemplatedRideSchema = new mongoose.Schema(
  {
    from: String,
    to: String,
    fromAddress: String,
    toAddress: String,
    time: String,
    arrivalTime: String,
    departureTime: String,
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drivers',
    },
    fromLocation: Object,
    toLocation: Object,
    seats: Number,
    price: Number,
    discountedPrice: Number,
  },
  { timestamps: true }
);

const TemplatedRide = mongoose.model(
  'TemplatedRides',
  TemplatedRideSchema,
  'templatedRides'
);
export default TemplatedRide;
