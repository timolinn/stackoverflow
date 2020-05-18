import { Router, Request, Response } from "express";
import Container from "typedi";
import UserController from "./UserController";
import { validateRequestData } from "../../middleware/validation";
import { catchError } from "../../helpers";

const router = Router();
const userCtrl = Container.get<UserController>("user.controller");

/**
 * @swagger
 * /users/signup:
 *  get:
 *    security:
 *    description: Returns all users
 *    summary: Get all registered user.
 *    tags:
 *      - User
 */
router.post("/signup", validateRequestData, catchError(userCtrl.signUp));

export default router;
