const Event = require("../../model/EventModel");
const Booking = require("../../model/BookingModel");
const { user, singleEvent } = require("./merge");

module.exports = {
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
