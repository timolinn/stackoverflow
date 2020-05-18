import mongoose from "mongoose";
import { logger } from "../util/logger";
import redisClient from "../lib/redisClient";
import { User } from "../components/user/UserModel";

export function teardown(done: any) {
  mongoose.connection.db.dropCollection("users", (err, result) => {
    if (err) {
      throw err;
    }
    done();
  });
}

export async function stopRedis() {
  await new Promise((resolve) => {
    redisClient().then(client => client.quit(() => {
      resolve();
      logger.info("Redis stopped");
    })).catch(logger.error);
  });
  // Redis.quit() creates a thread to close the connection.
  // We wait until all threads have been run once to ensure the connection closes.
  await new Promise(resolve => setImmediate(resolve));
}

export function generateBearerToken(): string {
  return new User({ id: "fakemongoid", role: "user" })
    .serializeAuthenticatedUser().accessToken;
}
