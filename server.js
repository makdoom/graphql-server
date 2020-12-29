import express from "express";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import schema from "./schema/schema.js";

const app = express();

// endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up & running at ${port}`));
