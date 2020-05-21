/**
 * Dependency injector
 */
import { Container } from "typedi";

import {
  QuestionService,
  QuestionInterface,
  Question,
  QuestionController,
} from "../components/question";
import {
  AnswerService,
  AnswerInterface,
  Answer,
  AnswerController,
} from "../components/answer";

import { Voter } from "../components/voter/Voter";
import { SearchService, Search } from "../components/search";

import AuthController from "../components/auth/AuthController";
import { UserInterface, User } from "../components/user/userModel";
import UserService from "../components/user/UserService";
import UserController from "../components/user/UserController";

import { logger } from "../util/logger";
import Mailer from "../services/Mailer";
import sendgrid from "../services/sendgrid";

// Services
Container.set("logger", logger);
Container.set("user.service", new UserService<UserInterface>(User));
Container.set(
  "question.service",
  new QuestionService<QuestionInterface>(Question, new Voter(), logger),
);
Container.set(
  "answer.service",
  new AnswerService<AnswerInterface>(Answer, new Voter(), logger),
);
Container.set("search.service", new SearchService(logger));

// External services
Container.set("mailer", new Mailer(sendgrid));

// Controllers
Container.set(
  "auth.controller",
  new AuthController(
    Container.get("user.service"),
    logger,
    Container.get("mailer"),
  ),
);
Container.set(
  "user.controller",
  new UserController(
    Container.get("user.service"),
    logger,
    Container.get("mailer"),
  ),
);
Container.set(
  "question.controller",
  new QuestionController(
    Container.get("question.service"),
    Container.get("answer.service"),
    logger,
    Container.get("mailer"),
  ),
);
Container.set(
  "answer.controller",
  new AnswerController(
    Container.get("answer.service"),
    Container.get("question.service"),
    logger,
    Container.get("mailer"),
  ),
);
