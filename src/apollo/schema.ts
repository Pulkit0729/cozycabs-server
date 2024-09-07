import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  scalar JSON

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
    ): [TemplatedRide]
    rides(
      filterBy: RideFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Ride]
    points(
      filterBy: PointFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Point]
    bookings(
      filterBy: BookingFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Booking]
    bookings2(
      filterBy: BookingFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Booking]
    bookingPoints(
      filterBy: BookingPointFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [BookingPoint]
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
    admins(
      filterBy: AdminFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Admin]
    blablas(
      filterBy: BlablaFilter
      sortBy: String
      sortOrder: SortOrder
      page: Int
      perPage: Int
    ): [Blabla]
    termsAndConditions(
      filterBy: TermsAndConditionFilter
      sortBy: String
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
    addAdmin(input: AdminInput): Admin
    addBlabla(input: BlablaInput): Blabla
    addDriver(input: DriverInput): Driver
    addTemplatedRide(input: TemplatedRideInput): TemplatedRide
    addRide(input: RideInput): Ride
    addPoint(input: PointInput): Point
    addBooking(input: BookingInput): Booking
    addBookingPoint(input: BookingPointInput): BookingPoint
    addPromo(input: PromoInput): Promo
    addUserPromo(input: UserPromoInput): UserPromo
    addTermsAndCondition(input: TermsAndConditionInput): TermsAndCondition

    addBulkPoints(input: [PointInput]): [Point]

    updateTemplatedRide(
      templateRideId: String!
      input: TemplatedRideUpdateInput!
    ): TemplatedRide
    updateAdmin(adminId: String!, input: AdminUpdateInput!): Admin
    updateBlabla(blablaId: String!, input: BlablaUpdateInput!): Blabla
    updateRide(rideId: String!, input: RideUpdateInput!): Ride
    updatePoint(pointId: String!, input: PointUpdateInput!): Point
    updateBooking(bookingId: String!, input: BookingUpdateInput!): Booking
    updateBookingPoint(
      bookingPointId: String!
      input: BookingPointUpdateInput!
    ): BookingPoint
    updatePromo(promoId: String!, input: PromoUpdateInput!): Promo
    updateTermsAndCondition(
      id: String!
      input: TermsAndConditionUpdateInput!
    ): TermsAndCondition
  }
`;
