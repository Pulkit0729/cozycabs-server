import Booking from "../models/bookings";
import Driver from "../models/drivers";
import Ride from "../models/rides";
import TemplatedRide from "../models/templated_rides";
import User from "../models/users";


export const resolvers = {
  Query: {
    users: async (_: any, { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder)
      const users = await User.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return users;
    },
    drivers: async (_: any, { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder)
      const drivers = await Driver.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return drivers;
    },
    templatedRides: async (_: any, { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder)
      const rides = await TemplatedRide.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return rides;
    },
    rides: async (_: any, { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder)
      const rides = await Ride.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return rides;
    },
    bookings: async (_: any, { filterBy, sortBy, sortOrder, page = 1, perPage = 10 }: any) => {
      let { query, sortOptions } = constructQuery(filterBy, sortBy, sortOrder);
      console.log(query);
      const bookings = await Booking.find(query)
        .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage);
      return bookings;
    },
  },
  Mutation: {
    addUser: (_: any, { input }: any) => {
      const newUser = new User(input);
      return newUser.save();
    },
    addDriver: (_: any, { input }: any) => {
      const newDriver = new Driver(input);
      return newDriver.save();
    },
    addBooking: (_: any, { input }: any) => {
      const newBook = new Booking(input);
      return newBook.save();
    },
    addTemplatedRide: (_: any, { input }: any) => {
      const newRide = new TemplatedRide(input);
      return newRide.save();
    },
    addRide: (_: any, { input }: any) => {
      const newRide = new Ride(input);
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
    updateRide: async (_: any, { id, input }: any) => {
      try {
        const ride = await Ride.findById(id);
        if (!ride) {
          throw new Error('Ride not found');
        }

        // Update ride properties if provided in the input
        if (input.status) {
          ride.status = input.status;
        }
        if (input.blabla_ride_id) {
          ride.blabla_ride_id = input.blabla_ride_id;
        }
        if (input.seats) {
          ride.seats = input.seats;
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
          throw new Error('Ride not found');
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
    }
  },
};


function constructQuery(filterBy: any, sortBy: string | number, sortOrder: string) {
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
    Object.entries(filterBy).forEach(([key, value]) => {
      if (key !== 'AND' && key !== 'OR' && value != null) {
        if (isNaN(value as any) && (typeof value != "boolean")) {
          query[key] = { $regex: value, $options: 'i' };
        }
        else {
          query[key] = value;
        }
      }
    });
  }
  const sortOptions: any = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'ASC' ? 1 : -1;
  }
  return { query, sortOptions }
}


function constructSubQuery(condition: any) {
  let query: any = {};

  Object.entries(condition).forEach(([key, value]) => {
    if (key !== 'AND' && key !== 'OR' && value != null) {
      if (isNaN(value as any) && (typeof value != "boolean")) {
        query[key] = { $regex: value, $options: 'i' };
      }
      else {
        query[key] = value;
      }
    }
  });

  return query;
}