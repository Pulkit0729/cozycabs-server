import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  scalar JSON

  type Query {
    users(
      filterBy: UserFilter
      sortBy: string
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [User]
    drivers(
      filterBy: DriverFilter
      sortBy: string
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Driver]
    templatedRides(
      filterBy: TemplatedRideFilter
      sortBy: string
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [TemplatedRide]
    rides(
      filterBy: RideFilter
      sortBy: string
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Ride]
    bookings(
      filterBy: BookingFilter
      sortBy: string
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Booking]
    promos(
      filterBy: PromoFilter
      sortBy: string
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Promo]
    userPromos(
      filterBy: UserPromoFilter
      sortBy: string
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [UserPromos]
    termsAndConditions(
      filterBy: TermsAndConditionFilter
      sortBy: string
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [TermsAndCondition]
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
    addUserPromo(input: UserPromoInput): UserPromos
    addTermsAndCondition(input: TermsAndConditionInput): TermsAndCondition

    updateTemplatedRide(
      id: string!
      input: TemplatedRideUpdateInput!
    ): TemplatedRide
    updateRide(id: string!, input: RideUpdateInput!): Ride
    updateBooking(bookingId: string!, input: BookingUpdateInput!): Booking
    updatePromo(promoId: string!, input: PromoUpdateInput!): Promo
    updateTermsAndCondition(
      id: string!
      input: TermsAndConditionUpdateInput!
    ): TermsAndCondition
  }
`;
