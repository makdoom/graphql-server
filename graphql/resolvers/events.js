const Event = require("../../model/EventModel");
const { user } = require("./merge");

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
};
