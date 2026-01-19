import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ListingAPI } from "./datasources/listing-api";
import { resolvers } from "./resolvers";

import { readFileSync } from "fs";
import { gql } from "graphql-tag";
import path from "path";

const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./schema.graphql"), {
    encoding: "utf-8",
  })
);

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;

      return {
        dataSources: {
          listingAPI: new ListingAPI({ cache }),
        },
      };
    },
  });
  console.log(`
      🚀 Server is running!
      📪 Query at ${url}
    `);
}

startApolloServer().then(r => {});
