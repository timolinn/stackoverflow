import redis from "redis";
import config from "../config";
import { logger } from "../util/logger";

let client: redis.RedisClient;

export default function getRedisClient(): Promise<redis.RedisClient> {
  return new Promise((resolve, reject) => {

    if (client) {
      return resolve(client);
    }
    const opts: redis.ClientOpts = {
      port: parseInt(config.redis.port, 10),
      host: config.redis.host,
    // Tls: {}
    };

    const redisClient = redis.createClient(opts);

    redisClient.on("connect", () => {
      logger.debug("redis server connected");
      client = redisClient;
      resolve(client);
    });

    redisClient.on("error", (err) => {
      logger.debug("redis error: " + err.message);
      reject(err);
    });
  });
}
