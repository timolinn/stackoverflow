import { Router } from "express";
import Container from "typedi";
import { validateRequestData, isObjectId } from "../../middleware/validation";
import { catchError } from "../../helpers";
import { QuestionController } from ".";
import decodeBearerToken from "../../middleware/decodeBearerToken";

const router = Router();
const questionCtrl = Container.get<QuestionController>("question.controller");

/**
 * @swagger
 * /question:
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
  catchError(questionCtrl.get),
);

/**
 * @swagger
 * /question/upvote:
 *  get:
 *    security:
 *    description: Returns all users
 *    summary: Get all registered user.
 *    tags:
 *      - User
 */
router.post(
  "/:questionId/upvote",
  isObjectId("questionId"),
  decodeBearerToken,
  catchError(questionCtrl.upvote),
);

/**
 * @swagger
 * /question/downvote:
 *  get:
 *    security:
 *    description: Returns all users
 *    summary: Get all registered user.
 *    tags:
 *      - User
 */
router.post(
  "/:questionId/downvote",
  isObjectId("questionId"),
  decodeBearerToken,
  catchError(questionCtrl.downvote),
);

export default router;
