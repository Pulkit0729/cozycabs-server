import { gql } from "apollo-server-express";
import TemplatedRide from "../models/templated_rides";
import { IDriver } from "../models/drivers";
import { constructQuery } from "../utils/apollo.util";

export const templateTypeDefs = gql`

  type TemplatedRide {
    id: String!
    from: String!
    to: String!
    from_address: String!
    to_address: String!
    arrival_time: String
    departure_time: String
    driver: Driver
    seats: Int!
    price: Int!
    discounted_price: Int!
  }

  input TemplatedRideInput {
    from: String!
    to: String!
    from_address: String!
    to_address: String!
    arrival_time: String!
    departure_time: String!
    driver: String!
    seats: Int!
    price: Int!
    discounted_price: Int!
  }
  input TemplatedRideUpdateInput {
    from: String
    to: String
    from_address: String
    to_address: String
    arrival_time: String
    departure_time: String
    driver: String
    seats: Int
    price: Int
    discounted_price: Int
  }
  
  input TemplatedRideFilter {
    AND: [TemplatedRideFilter]
    OR: [TemplatedRideFilter]
    id: String
    from: String
    to: String
    from_address: String
    to_address: String
    arrival_time: String
    departure_time: String
    driver: String
    seats: Int
    price: Int
    discounted_price: Int
  }  `

export const templateResolvers = {
    Query: {

        templatedRides: async (_: any, { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any) => {
            let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder)
            const rides = await TemplatedRide.find(query)
                .sort(sortOptions)
                .skip((page - 1) * perPage)
                .limit(perPage).populate<{ driver: IDriver }>('driver');
            return rides;
        }
    },
    Mutation: {
        addTemplatedRide: (_: any, { input }: any) => {
            const newRide = new TemplatedRide(input);
            return newRide.save();
        },
        updateTemplatedRide: async (_: any, { id, input }: any) => {
            try {
                const templatedRide = await TemplatedRide.findById(id);
                if (!templatedRide) {
                    throw new Error('Ride not found');
                }

                // Update templatedRide properties if provided in the input
                if (input.arrival_time) {
                    templatedRide.time = input.arrival_time;
                }
                if (input.departure_time) {
                    templatedRide.time = input.departure_time;
                }
                if (input.seats) {
                    templatedRide.seats = input.seats;
                }
                if (input.price) {
                    templatedRide.price = input.price;
                }
                if (input.discounted_price) {
                    templatedRide.discounted_price = input.discounted_price;
                }
                // Save the updated templatedRide
                await templatedRide.save();

                return templatedRide;
            } catch (error: any) {
                throw new Error(`Failed to update templatedRide: ${error.message}`);
            }
        },

    },
};
