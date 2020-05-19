import { Router, Request, Response } from "express";
import Container from "typedi";
import { validateRequestData, isObjectId } from "../../middleware/validation";
import { catchError } from "../../helpers";
import { QuestionController } from ".";
import decodeBearerToken from "../../middleware/decodeBearerToken";

const router = Router();
const questionCtrl = Container.get<QuestionController>("question.controller");

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
router.post(
  "/",
  decodeBearerToken,
  validateRequestData,
  catchError(questionCtrl.create),
);

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
router.get(
  "/:questionId",
  isObjectId("questionId"),
  validateRequestData,
  catchError(questionCtrl.get),
);

export default router;
