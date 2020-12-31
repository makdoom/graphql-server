const Event = require("../../model/EventModel");
const User = require("../../model/UserModel");

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

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
