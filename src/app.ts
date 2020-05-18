// Sideeffects
import "reflect-metadata";

// Register dependencies
import "./config/di";

import express, { NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morganLogger from "morgan";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import exUseragent from "express-useragent";
import helmet from "helmet";
import config from "./config";
import { logger } from "./util/logger";
import swaggerDefinition from "./docs/api-specs";
import { errorHandler, AppError, ErrorNames } from "./handlers/error";
import { StatusCodes } from "./handlers/http";
import { renderEmail } from "./helpers";


// Load passport
import passport from "./config/passport";

// Routes
import authRouter from "./components/auth/AuthRoutes";
import userRouter from "./components/user/UserRoutes";
import isBlacklisted from "./middleware/isBlacklisted";

// Create express application
const app = express();

// Connect to mongo
mongoose.Promise = global.Promise;

const dbURL = config.env === "test" ? config.TEST_DB : config.MONGODB_URI;
mongoose.connect(dbURL, {
  useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,
}).then(() => {
  logger.info("database connection established");
}).catch((err) => {
  logger.error("database connection failed " + err);
  process.exit(1);
});


app.use(helmet());
app.use(exUseragent.express());
app.use(passport.initialize());

// CORS
const allowedOrigins = [
  "http://localhost:5000",
  "https://staging.stackoverflowclone.com",
  "https://stackoverflowclone.com",
  "*",
];
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not "
                    + "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    // To enable HTTP cookies over CORS
    credentials: true,
    maxAge: 1728000,
  }),
);

// HTTP requests console logger
app.use(morganLogger("dev"));

// Accept HTML forms
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());
app.use(isBlacklisted); // Checks if the auth token is blacklisted

app.get("/", (req: express.Request, res: express.Response) =>
  res.status(StatusCodes.OK).json({ status: "success", message: "Flash Docx API", data: null }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Handle favicon requests from browsers
app.get("/favicon.ico", (req, res) => res.sendStatus(StatusCodes.NO_CONTENT));

// Render email template
app.get("/email/:template", renderEmail);

// Setup Swagger/OpenAPI Documentation
app.use("/api/v1/docs", swaggerUI.serve);
app.get("/api/v1/docs", swaggerUI.setup(swaggerJSDoc(swaggerDefinition)));

// Match non existing routes
app.use("*", (req, res, next) => {
  const err = new AppError(ErrorNames.InvalidURLError, StatusCodes.BAD_REQUEST,
    { description: "endpoint does not exist", isOperational: true });
  next(err);
});

app.set("port", config.PORT || 3000);

// Error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (config.env !== "development") return next(err);
  const Err = errorHandler.handleError(err);
  Err.stack = err.stack ;
  return res.status(Err.error.code)
    .json(Err);
});

// Production error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) =>
  res.status(err.code || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(errorHandler.handleError(err))
);

process.on("unhandledRejection", (reason) => {
  throw reason;
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${500} - ${err.message}, Stack: ${err.stack}`);
  process.kill(process.pid, "SIGTERM");
});

export default app;
