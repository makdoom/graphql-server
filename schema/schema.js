const { buildSchema } = require("graphql");

const schema = buildSchema(`
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
`);

module.exports = schema;
