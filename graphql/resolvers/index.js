const bcrypt = require("bcryptjs");

const Event = require("../../model/EventModel");
const User = require("../../model/UserModel");
const Booking = require("../../model/BookingModel");

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        creator: user.bind(this, event.creator),
      };
    });
  } catch (error) {
    throw error;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return { ...event._doc, creator: user.bind(this, event.creator) };
  } catch (error) {
    throw error;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find({});
      return events.map((event) => {
        return {
          ...event._doc,
          creator: user.bind(this, event._doc.creator),
          date: new Date(event._doc.date).toISOString(),
        };
      });
    } catch (error) {
      throw error;
    }
  },

  bookings: async (args) => {
    try {
      const bookings = await Booking.find({});
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (error) {
      throw error;
    }
  },

  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5fedac3f2699fa255c51aa01",
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        creator: user.bind(this, result._doc.creator),
        date: new Date(event._doc.date).toISOString(),
      };
      const fetchedUser = await User.findById("5fedac3f2699fa255c51aa01");

      if (!fetchedUser) throw new Error("User not found");
      fetchedUser.createdEvents.push(event);

      await fetchedUser.save();
      return createdEvent;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (args) => {
    try {
      const userFetched = await User.findOne({ email: args.userInput.email });
      if (userFetched) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await newUser.save();
      return { ...result._doc, password: null };
    } catch (error) {
      throw error;
    }
  },

  bookEvent: async (args) => {
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        event: fetchedEvent,
        user: "5fedac3f2699fa255c51aa01",
      });

      const result = await booking.save();
      return {
        ...result._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = {
        ...booking.event._doc,
        creator: user.bind(this, booking.event._doc.creator),
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  },
};
