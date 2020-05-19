import passport from "passport";
import passportLocal from "passport-local";
import passportJWT, { ExtractJwt } from "passport-jwt";
import Container from "typedi";
import UserService from "../components/user/UserService";
import { UserInterface } from "../components/user/userModel";
import config from "./";
import { AppError, ErrorNames } from "../handlers/error";
import { StatusCodes } from "../handlers/http";
import { logger } from "../util/logger";

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const userService = Container.get<UserService<UserInterface>>("user.service");

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new LocalStrategy({
  usernameField: "email",
  session: false,
}, (email, password, done) => {
  const errMsg = new AppError(ErrorNames.AuthenticationError, StatusCodes.FORBIDDEN, {
    description: "invalid email or password",
    isOperational: true,
  });
  userService.findUserByEmail(email)
    .then(user => {
      if (!user) {
        errMsg.options.description = `user with Email:${email} not found`;
        logger.debug(errMsg);
        return done(errMsg, null, { message: "invalid email or password" });
      }
      if (!user.comparePassword(password)) {
        errMsg.options.description = `wrong password for Email:${email} was supplied`;
        logger.debug(errMsg);
        return done(errMsg, null, { message: "invalid email or password" });
      }
      return done(null, user, {
        message: "login successful",
      });
    }).catch(err => {
      logger.debug(err);
      done(errMsg, null, { message: "invalid email or password" });
    });
}), );

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
}, (jwtPayload, done) => done(null, jwtPayload, { message: "authentication successful" })));

export default passport;
