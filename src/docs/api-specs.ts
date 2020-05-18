import { resolve } from "path";
import config from "../config";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "StackoverflowClone",
      version: "0.1.0",
      description: "StackoverflowClone API Documentation",
      contact: {
        name: "StackoverflowClone",
        url: "https://stackoverflowclone.com",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
    servers: [
      {
        url: `http://localhost:${config.PORT}/api/v1`,
        description: "Local Host",
      },
      {
        url: "https://stackoverflowclone.com/api/v1",
        description: "Production Server",
      },
      {
        url: "https://staging.stackoverflowclone.com/api/v1",
        description: "Staging Server",
      },
    ],
  },
  apis: [
    resolve(__dirname, "./resources/*.yaml"),
    resolve(__dirname, "../components/**/*Routes.js"),
  ],
};

export default options;
