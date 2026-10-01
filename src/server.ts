import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./infrastructure/database/prisma.js";
import { logger } from "./infrastructure/logger/logger.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "FitVerse API is running");
});

async function shutdown(signal: NodeJS.Signals) {
  logger.info({ signal }, "Shutting down FitVerse API");
  server.close(() => {
    void prisma.$disconnect().finally(() => {
      process.exit(0);
    });
  });
}

process.on("SIGTERM", (signal) => {
  void shutdown(signal);
});
process.on("SIGINT", (signal) => {
  void shutdown(signal);
});
