import Booking from "../models/bookings";
import Driver from "../models/drivers";
import Ride from "../models/rides";
import TemplatedRide from "../models/templated_rides";
import User from "../models/users";

import { GraphQLScalarType, Kind } from "graphql";

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    if (value instanceof Date) {
      return value.toLocaleString().split(",")[0]; // Convert outgoing Date to integer for JSON
    }
    throw Error("GraphQL Date Scalar serializer expected a `Date` object");
  },
  parseValue(value) {
    if (typeof value === "number") {
      return new Date(value); // Convert incoming integer to Date
    }
    if (typeof value === "string" && !isNaN(parseFloat(value))) {
      return new Date(parseFloat(value));
    }
    throw new Error("GraphQL Date Scalar parser expected a `number`");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      let date = new Date(parseInt(ast.value, 10));
      date.setHours(5, 30);
      return date;
    }
    if (ast.kind === Kind.STRING) {
      let date = new Date(parseInt(ast.value, 10));
      date.setHours(5, 30);
      return date;
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});

export const resolvers = {
  Date: dateScalar,
  Query: {
    users: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder);
      const users = await User.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return users;
    },
    drivers: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder);
      const drivers = await Driver.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return drivers;
    },
    templatedRides: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder);
      const rides = await TemplatedRide.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return rides;
    },
    rides: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder);
      const rides = await Ride.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return rides;
    },
    bookings: async (
      _: any,
      { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any
    ) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder);
      const bookings = await Booking.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return bookings;
    },
  },
  Mutation: {
    addUser: async (_: any, { input }: any) => {
      const newUser = new User(input);
      return await newUser.save();
    },
    addDriver: async (_: any, { input }: any) => {
      const newDriver = new Driver(input);
      return await newDriver.save();
    },
    addBooking: async (_: any, { input }: any) => {
      const newBook = new Booking(input);
      return await newBook.save();
    },
    addTemplatedRide: async (_: any, { input }: any) => {
      const newRide = new TemplatedRide(input);
      return await newRide.save();
    },
    addRide: async (_: any, { input }: any) => {
      const newRide = new Ride(input);
      return await newRide.save();
    },
    updateTemplatedRide: async (_: any, { id, input }: any) => {
      try {
        const templatedRide = await TemplatedRide.findById(id);
        if (!templatedRide) {
          throw new Error("Ride not found");
        }

        // Update templatedRide properties if provided in the input
        if (input.arrival_time) {
          templatedRide.time = input.arrival_time;
        }
        if (input.departure_time) {
          templatedRide.time = input.departure_time;
        }
        if (input.seats != false || input.seats == 0) {
          templatedRide.seats = input.seats;
        }
        if (input.price) {
          templatedRide.price = input.price;
        }
        if (input.discounted_price) {
          templatedRide.discounted_price = input.discounted_price;
        }
        if (input.status) {
          templatedRide.status = input.status;
        }
        // Save the updated templatedRide
        await templatedRide.save();

        return templatedRide;
      } catch (error: any) {
        throw new Error(`Failed to update templatedRide: ${error.message}`);
      }
    },
    updateRide: async (_: any, { id, input }: any) => {
      try {
        const ride = await Ride.findById(id);
        if (!ride) {
          throw new Error("Ride not found");
        }

        // Update ride properties if provided in the input
        if (input.status) {
          ride.status = input.status;
        }
        if (input.blabla_ride_id) {
          ride.blabla_ride_id = input.blabla_ride_id;
        }
        if (input.seats != false || input.seats == 0) {
          ride.seats = input.seats;
        }
        if (input.price) {
          ride.price = input.price;
        }
        if (input.discounted_price) {
          ride.discounted_price = input.discounted_price;
        }
        // Save the updated ride
        await ride.save();

        return ride;
      } catch (error: any) {
        throw new Error(`Failed to update ride: ${error.message}`);
      }
    },
    updateBooking: async (_: any, { bookingId, input }: any) => {
      try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
          throw new Error("Ride not found");
        }

        // Update booking properties if provided in the input
        if (input.is_paid) {
          booking.is_paid = input.is_paid;
        }
        if (input.is_cancelled) {
          booking.is_cancelled = input.is_cancelled;
        }
        // Save the updated booking
        await booking.save();

        return booking;
      } catch (error: any) {
        throw new Error(`Failed to update ride: ${error.message}`);
      }
    },
  },
};

function constructQuery(
  filterBy: any,
  sortBy: string | number,
  sortOrder: string
) {
  let query: any = {};
  if (filterBy) {
    if (filterBy.AND) {
      // Handle AND conditions
      query.$and = filterBy.AND.map((condition: any) => {
        return constructSubQuery(condition);
      });
    }

    if (filterBy.OR) {
      // Handle OR conditions
      query.$or = filterBy.OR.map((condition: any) => {
        return constructSubQuery(condition);
      });
    }

    // Handle individual column filters
    query = { ...query, ...constructSubQuery(filterBy) };
  }
  const sortOptions: any = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "ASC" ? 1 : -1;
  }
  return { query, sortOptions };
}

function constructSubQuery(condition: any) {
  let query: any = {};

  Object.entries(condition).forEach(([key, value]) => {
    if (key !== "AND" && key !== "OR" && isValueDefined(value)) {
      if (
        isNaN(value as any) &&
        typeof value != "boolean" &&
        key != "id" &&
        typeof value != "object"
      ) {
        query[key] = { $regex: value, $options: "i" };
      } else if (key == "id") {
        query["_id"] = value;
      } else {
        query[key] = value;
      }
    }
  });

  return query;
}

function isValueDefined(value: any) {
  let res1 = value != null;
  let res2 = value != undefined;
  let res3 = typeof value == "boolean" || value != "";
  let res4 = value != "null";
  return res1 && res2 && res3 && res4;
}
