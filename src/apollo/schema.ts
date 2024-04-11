import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    phone: String!
  }

  type Driver {
    id: ID!
    name: String!
    phone: String!
    email: String
    car_name: String
    car_no: String
  }

  type Ride {
    id: ID!
    ride_id: String!
    from: String!
    to: String!
    date: String!
    time: String!
    driver_no: String!
    driver_name: String!
    seats: Int!
    price: Int!
    ride_no: Int!
    status: String!
  }

  type Booking {
    id: ID!
    ride_id: String!
    from: String!
    to: String!
    date: String!
    time: String!
    driver_no: String!
    user_no: String!
    user_name: String!
    seats: Int!
    total: Int!
    is_paid: Boolean!
    is_cancelled: Boolean!
    status: String!
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

  input RideInput {
    ride_id: String!
    from: String!
    to: String!
    date: String!
    time: String!
    driver_no: String!
    driver_name: String!
    seats: Int!
    price: Int!
    ride_no: Int!
    status: String!
  }
  input RideUpdateInput {
    ride_id: String
    from: String
    to: String
    date: String
    time: String
    driver_no: String
    driver_name: String
    seats: Int
    price: Int
    ride_no: Int
    status: String
  }
  input BookingInput {
    ride_id: String!
    from: String!
    to: String!
    date: String!
    time: String!
    driver_no: String!
    user_no: String!
    user_name: String!
    seats: Int!
    total: Int!
    is_paid: Boolean!
    is_cancelled: Boolean!
    status: String!
  }
  input BookingUpdateInput {
    ride_id: String
    from: String
    to: String
    date: String
    time: String
    driver_no: String
    user_no: String
    user_name: String
    seats: Int
    total: Int
    is_paid: Boolean
    is_cancelled: Boolean
    status: String
  }

  input UserFilter {
    AND: [UserFilter]
    OR: [UserFilter]
    name: String
    phone: String
  }

  input DriverFilter {
    AND: [DriverFilter]
    OR: [DriverFilter]
    name: String
    phone: String
    email: String
    car_name: String
    car_no: String
  }

  input RideFilter {
    AND: [RideFilter]
    OR: [RideFilter]
    ride_id: String
    from: String
    to: String
    date: String
    time: String
    driver_no: String
    driver_name: String
    seats: Int
    price: Int
    ride_no: Int
    status: String
  }

  input BookingFilter {
    AND: [BookingFilter]
    OR: [BookingFilter]
    ride_id: String
    from: String
    to: String
    date: String
    time: String
    driver_no: String
    user_no: String
    user_name: String
    seats: Int
    total: Int
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
    ):[Driver]
    rides(
      filterBy: RideFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ):[Ride]
    bookings(
      filterBy: BookingFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ):[Booking]
  }
  enum SortOrder {
    ASC
    DESC
  }
  type Mutation {
    addUser(input: UserInput!): User
    addDriver(input: DriverInput!): Driver
    addRide(input: RideInput!): Ride
    updateRide(rideId: String!, input: RideUpdateInput!): Ride
    addBooking(input: BookingUpdateInput!): Booking
    updateBooking(bookingId: String!, input: BookingInput!): Booking
  }
`;