const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./model/EventModel");
const User = require("./model/UserModel");

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

// Database config
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(port, () =>
      console.log(`Connected to database and running at ${port}`)
    );
  })
  .catch((error) => {
    console.log(error);
  });

// Single endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
         email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutations {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutations
      }
    `),
    rootValue: {
      events: () => {
        return Event.find({})
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc };
            });
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      },

      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "5fec30177e2cbe0308293fab",
        });
        let createdEvent;
        return event
          .save()
          .then((result) => {
            createdEvent = { ...result._doc };
            return User.findById("5fec30177e2cbe0308293fab");
          })
          .then((user) => {
            if (!user) throw new Error("User not found");
            user.createdEvents.push(event);
            return user.save();
          })
          .then((result) => {
            return createdEvent;
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      },

      createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
          .then((user) => {
            if (user) throw new Error("User already exists");
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashedPassword) => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, password: null };
          })
          .catch((error) => {
            throw error;
          });
      },
    },
    graphiql: true,
  })
);
