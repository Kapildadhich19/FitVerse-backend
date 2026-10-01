import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import path from "node:path";

import { env } from "./config/env.js";
import { openApiDocument } from "./config/openapi.js";
import { logger } from "./infrastructure/logger/logger.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { avatarRouter } from "./modules/avatar/avatar.routes.js";
import { digitalTwinRouter } from "./modules/digital-twin/digital-twin.routes.js";
import { productRouter } from "./modules/product/product.routes.js";
import { userRouter } from "./modules/user/user.routes.js";
import { errorHandler } from "./shared/middleware/error-handler.js";
import { notFoundHandler } from "./shared/middleware/not-found.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use(pinoHttp({ logger }));

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      service: "fitverse-api"
    });
  });
  app.get("/api/docs", (_request, response) => {
    response.json(openApiDocument);
  });
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.use("/api/auth", authRouter);
  app.use("/api/digital-twin", digitalTwinRouter);
  app.use("/api/users", userRouter);
  app.use("/api/products", productRouter);
  app.use("/api/avatar", avatarRouter);
  app.use("/api/avatars", avatarRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
