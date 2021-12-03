import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const app = express();
  const PORT = 4000;

  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
