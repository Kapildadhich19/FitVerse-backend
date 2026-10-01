import pino from "pino";

import { env } from "../../config/env.js";

const loggerOptions: pino.LoggerOptions =
  env.NODE_ENV === "development"
    ? {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard"
          }
        }
      }
    : {
        level: "info"
      };

export const logger = pino(loggerOptions);
