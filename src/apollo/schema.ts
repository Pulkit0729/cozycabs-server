import gql from "graphql-tag";

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
    promos(
      filterBy: PromoFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Promo]
    userPromos(
      filterBy: UserPromoFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [UserPromo]
  }
  enum SortOrder {
    ASC
    DESC
  }
  type Mutation {
    addUser(input: UserInput): User
    addDriver(input: DriverInput): Driver
    addTemplatedRide(input: TemplatedRideInput): TemplatedRide
    addRide(input: RideInput): Ride
    addBooking(input: BookingInput): Booking
    addPromo(input: PromoInput): Promo
    addUserPromo(input: UserPromoInput): UserPromo

    updateTemplatedRide(id: String!, input: TemplatedRideUpdateInput!): TemplatedRide
    updateRide(id: String!, input: RideUpdateInput!): Ride
    updateBooking(bookingId: String!, input: BookingUpdateInput!): Booking
    updatePromo(promoId: String!, input: PromoUpdateInput!): Promo 
  }
`;