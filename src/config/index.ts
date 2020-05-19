/* eslint-disable no-process-env */
import dotenv from "dotenv";
import { existsSync } from "fs";

interface Config {
  MONGODB_URI: string;
  TEST_DB: string;
  PORT: number;
  jwt: {
    secret: string;
    refreshTokenSecret: string;
    expiresIn: number;
    refreshTokenExpiresIn: number;
  };
  env: string;
  apiVersion: string;
  mail: { from: { name: string; email: string } };
  sendgrid: { apiKey: string };
  redis: { host: string; port: string };
}

const production = process.env.NODE_ENV === "production";
const test = process.env.NODE_ENV === "test";

if (!existsSync(".env") && !test) {
  // eslint-disable-next-line no-console
  console.error(
    ".env file does not exists. please create it by copying .env.example into .env",
  );
  process.exit(1);
}

dotenv.config({ path: ".env" });


export default <Config> {
  PORT: process.env.SERVER_PORT || 3000,
  MONGODB_URI: production
    ? process.env.MONGODB_URI
    : process.env.MONGODB_URI_LOCAL,
  TEST_DB: "mongodb://localhost:27017/stackoverflow-clone-test",
  jwt: {
    secret: test ? "2655D4EB4E0E7F5AA31AD6F2C140CF586C65980C24BE94E9BD5ACE4AD50761FC"
      : process.env.JWT_SECRET,
    refreshTokenSecret: test ? "C385337C149583FAAEDC60894F5244082BB16081CAB8C7EEFA670A9E801AF6C7"
      : process.env.REFRESH_JWT_SECRET,
    expiresIn: 15 * 60, // Expires every 15 mins
    refreshTokenExpiresIn: 86400 * 14, // Expires in 100 years
  },
  env: process.env.NODE_ENV,
  apiVersion: "1.0",
  mail: {
    from: {
      name: "StackoverflowClone",
      email: "support@stackoverflowclone.com",
    },
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
};
