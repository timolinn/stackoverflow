import mongoose from "mongoose";
import { logger } from "./util/logger";
import app from "./app";

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  logger.info(
    `  App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`,
  );
  logger.info("Press CTRL-C to stop");
});

// Gracefull shut downs
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received.");
  logger.info("Closing http server.");
  server.close(() => {
    logger.info("Http server closed.");
    // Boolean means [force]
    mongoose.connection.close(false, () => {
      logger.info("MongoDb connection closed.");
      process.exit(1);
    });
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received.");
  logger.info("Closing http server.");
  server.close(() => {
    logger.info("Http server closed.");
    // Boolean means [force]
    mongoose.connection.close(false, () => {
      logger.info("MongoDb connection closed.");
      process.exit(1);
    });
  });
});

export default server;
