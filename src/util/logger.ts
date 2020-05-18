/* eslint-disable no-process-env */
import winston from "winston";
import config from "../config";

export type LoggerInterface = winston.Logger;

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: config.env === "production" ? "error" : "debug",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      // Disable console transport for test environment
      silent: config.env === "test" ? true : false,
    }),
    new winston.transports.File({
      filename: "debug.log",
      level: "debug",
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "debug",
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
};


export const logger = winston.createLogger(options);
