const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema, createSourceEventStream } = require("graphql");
const dotenv = require("dotenv");
// const schema = require("./schema/schema");

const app = express();
dotenv.config();

const events = [];

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
        return events;
      },

      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: args.eventInput.date,
        };

        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up & running at ${port}`));
