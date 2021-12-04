import express from "express";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-express";
import { buildSchemaSync } from "type-graphql";
import { ProductResolver } from "./resolvers/products.resolver";

const prisma = new PrismaClient();

const main = async () => {
  const app = express();
  const PORT = 4000;

  const apolloServer = new ApolloServer({
    schema: await buildSchemaSync({
      resolvers: [ProductResolver],
      validate: false,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
