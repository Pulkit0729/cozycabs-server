import { gql } from "apollo-server-express";

export const typeDefs = gql`
scalar Date

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
    templatedRides(
      filterBy: TemplatedRideFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ):[TemplatedRide]
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
    addTemplatedRide(input: TemplatedRideInput!): TemplatedRide
    addRide(input: RideInput!): Ride
    updateTemplatedRide(id: String!, input: TemplatedRideUpdateInput!): TemplatedRide
    updateRide(id: String!, input: RideUpdateInput!): Ride
    addBooking(input: BookingUpdateInput!): Booking
    updateBooking(bookingId: String!, input: BookingInput!): Booking
  }
`;