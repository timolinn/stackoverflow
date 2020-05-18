/**
 * Dependency injector
 */
import { Container } from "typedi";

import UserService from "../components/user/UserService";

import { UserInterface, User } from "../components/user/UserModel";

import AuthController from "../components/auth/AuthController";
import UserController from "../components/user/UserController";

import { logger } from "../util/logger";
import Mailer from "../services/Mailer";
import sendgrid from "../services/sendgrid";

// Services
Container.set("user.service", new UserService<UserInterface>(User));

// External services
Container.set("mailer", new Mailer(sendgrid));

// Controllers
Container.set("auth.controller", new AuthController(Container.get("user.service"), logger, Container.get("mailer")));
Container.set("user.controller", new UserController(Container.get("user.service"), logger));
