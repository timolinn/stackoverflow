import Joi from "@hapi/joi";
import config from "../config";

const signupSchema = Joi.object().keys({
  firstName: Joi.string().strict().trim().required(),
  lastName: Joi.string().strict().trim().required(),
  email: Joi.string().strict().trim().email()
    .required(),
  password: Joi.string().regex(
    new RegExp('^[a-zA-Z0-9!@#*$&()\\-`.+,/"]{3,30}$'),
  ).min(8).required(),
  confirmPassword: Joi.ref("password"),
}).options({
  abortEarly: false,
  errors: {
    stack: config.env !== "producttion",
  },
});

const createQuestionSchema = Joi.object().keys({
  title: Joi.string().strict().trim().required(),
  body: Joi.string().strict().trim().required(),
  tags: Joi.array().items(Joi.string()).strict(),
}).options({
  abortEarly: false,
  errors: {
    stack: config.env !== "producttion",
  },
});

const createAnswerSchema = Joi.object().keys({
  text: Joi.string().strict().trim().required(),
  question: Joi.string().strict().trim().required(),
}).options({
  abortEarly: false,
  errors: {
    stack: config.env !== "producttion",
  },
});

const signinSchema = Joi.object().keys({
  email: Joi.string().strict().trim().email()
    .required(),
  password: Joi.string().regex(
    new RegExp('^[a-zA-Z0-9!@#*$&()\\-`.+,/"]{3,30}$'),
  ).min(8).required(),
}).options({
  abortEarly: false,
  errors: {
    stack: config.env !== "producttion",
  },
});

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().strict().trim().email()
    .required(),
}).options({
  abortEarly: true,
  errors: {
    stack: config.env !== "production",
  },
});

const resetPasswordSchema = Joi.object().keys({
  password: Joi.string().regex(
    new RegExp('^[a-zA-Z0-9!@#*$&()\\-`.+,/"]{3,30}$'),
  ).min(8).required(),
  confirmPassword: Joi.ref("password"),
}).options({
  abortEarly: false,
  errors: {
    stack: config.env !== "producttion",
  },
});

export default <Record<string, Joi.ObjectSchema>> {
  "/api/v1/users/signup": signupSchema,
  "/api/v1/auth/signin": signinSchema,
  "/api/v1/auth/password/forgot": forgotPasswordSchema,
  "/api/v1/auth/password/reset": resetPasswordSchema,
  "/api/v1/questions": createQuestionSchema,
  "/api/v1/answers": createAnswerSchema,
};
