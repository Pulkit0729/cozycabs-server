import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar Date

  type User {
    id: String!
    name: String!
    phone: String!
  }

  type Driver {
    id: String!
    name: String!
    phone: String!
    email: String
    car_name: String
    car_no: String
  }

  type TemplatedRide {
    id: String!
    from: String!
    to: String!
    from_address: String!
    to_address: String!
    arrival_time: String
    departure_time: String
    driver_no: String!
    driver_name: String!
    seats: Int!
    price: Int!
    discounted_price: Int!
    status: String!
  }
  type Ride {
    id: String!
    blabla_ride_id: String
    from: String!
    to: String!
    from_address: String!
    to_address: String!
    date: Date!
    arrival_time: String
    departure_time: String
    driver_no: String!
    driver_name: String!
    seats: Int!
    price: Int!
    discounted_price: Int!
    ride_no: Int!
    status: String!
  }

  type Booking {
    id: String!
    ride_id: String!
    from: String!
    to: String!
    date: Date!
    arrival_time: String
    departure_time: String
    driver_no: String!
    user_no: String!
    user_name: String!
    seats: Int!
    total: Int!
    discounted_total: Int!
    is_paid: Boolean!
    is_cancelled: Boolean!
    status: String!
    channel: String!
  }

  input UserInput {
    name: String!
    phone: String!
  }
  input DriverInput {
    name: String!
    phone: String!
    email: String
    car_name: String
    car_no: String
  }

  input TemplatedRideInput {
    from: String!
    to: String!
    from_address: String!
    to_address: String!
    arrival_time: String!
    departure_time: String!
    driver_no: String!
    driver_name: String!
    seats: Int!
    price: Int!
    discounted_price: Int!
    status: String!
  }
  input TemplatedRideUpdateInput {
    from: String
    to: String
    from_address: String
    to_address: String
    arrival_time: String
    departure_time: String
    driver_no: String
    driver_name: String
    seats: Int
    price: Int
    discounted_price: Int
    status: String
  }
  input RideInput {
    blabla_ride_id: String
    from: String!
    to: String!
    from_address: String!
    to_address: String!
    date: Date!
    arrival_time: String!
    departure_time: String!
    driver_no: String!
    driver_name: String!
    seats: Int!
    price: Int!
    discounted_price: Int!
    ride_no: Int!
    status: String!
  }
  input RideUpdateInput {
    blabla_ride_id: String
    from: String
    to: String
    from_address: String
    to_address: String
    date: Date
    arrival_time: String
    departure_time: String
    driver_no: String
    driver_name: String
    seats: Int
    price: Int
    discounted_price: Int
    ride_no: Int
    status: String
  }
  input BookingInput {
    ride_id: String!
    from: String!
    to: String!
    date: Date!
    arrival_time: String!
    departure_time: String!
    driver_no: String!
    user_no: String!
    user_name: String!
    seats: Int!
    total: Int!
    discounted_total: Int!
    channel: String!
    is_paid: Boolean!
    is_cancelled: Boolean!
    status: String!
  }
  input BookingUpdateInput {
    ride_id: String
    from: String
    to: String
    date: Date
    arrival_time: String
    departure_time: String
    driver_no: String
    user_no: String
    user_name: String
    seats: Int
    total: Int
    discounted_total: Int
    channel: String
    is_paid: Boolean
    is_cancelled: Boolean
    status: String
  }

  input UserFilter {
    AND: [UserFilter]
    OR: [UserFilter]
    id: String
    name: String
    phone: String
  }

  input DriverFilter {
    AND: [DriverFilter]
    OR: [DriverFilter]
    id: String
    name: String
    phone: String
    email: String
    car_name: String
    car_no: String
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
    driver_no: String
    driver_name: String
    seats: Int
    price: Int
    discounted_price: Int
    status: String
  }

  input RideFilter {
    AND: [RideFilter]
    OR: [RideFilter]
    id: String
    blabla_ride_id: String
    from: String
    to: String
    from_address: String
    to_address: String
    date: Date
    arrival_time: String
    departure_time: String
    driver_no: String
    driver_name: String
    seats: Int
    price: Int
    discounted_price: Int
    ride_no: Int
    status: String
  }

  input BookingFilter {
    AND: [BookingFilter]
    OR: [BookingFilter]
    id: String
    ride_id: String
    from: String
    to: String
    date: Date
    arrival_time: String
    departure_time: String
    driver_no: String
    user_no: String
    user_name: String
    seats: Int
    total: Int
    channel: String
    discounted_total: Int
    is_paid: Boolean
    is_cancelled: Boolean
    status: String
  }
  type Query {
    users(
      filterBy: UserFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [User]
    drivers(
      filterBy: DriverFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Driver]
    templatedRides(
      filterBy: TemplatedRideFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [TemplateRide]
    rides(
      filterBy: RideFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Ride]
    bookings(
      filterBy: BookingFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Booking]
  }
  enum SortOrder {
    ASC
    DESC
  }
  type Mutation {
    addUser(input: UserInput!): User
    addDriver(input: DriverInput!): Driver
    addTemplatedRide(input: TemplatedRideInput!): TemplatedRide
    addRide(input: RideInput!): Ride
    updateTemplatedRide(
      id: String!
      input: TemplatedRideUpdateInput!
    ): TemplatedRide
    updateRide(id: String!, input: RideUpdateInput!): Ride
    addBooking(input: BookingUpdateInput!): Booking
    updateBooking(bookingId: String!, input: BookingInput!): Booking
  }
`;
