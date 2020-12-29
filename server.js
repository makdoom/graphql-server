const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema, createSourceEventStream } = require("graphql");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// const schema = require("./schema/schema");

const Event = require("./model/EventModel");

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

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutations {
        createEvent(eventInput: EventInput): Event
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
        });

        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      },
    },
    graphiql: true,
  })
);
