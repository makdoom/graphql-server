const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const dotenv = require("dotenv");
// const schema = require("./schema/schema");

const app = express();
dotenv.config();

// endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        Price: Float!
        date: String!
      }

      type RootQuery {
        events: [String!]!
      }

      type RootMutations {
        createEvent(name: String!): String
      }

      schema {
        query: RootQuery
        mutation: RootMutations
      }
    `),
    rootValue: {
      events: () => {
        return ["Makdoom", "Mahek", "Ahad"];
      },

      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  })
);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up & running at ${port}`));
