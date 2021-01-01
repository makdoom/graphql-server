const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const dotenv = require("dotenv");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const databaseConnection = require("./dbConfig");
const isAuth = require("./middleware/is-auth");

const app = express();
dotenv.config();

// Port Conf
const port = process.env.PORT || 5000;

// Middleware
app.use(isAuth);

// Database config
databaseConnection();

// Single endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

app.listen(port, () => console.log(`Server running at ${port}`));
