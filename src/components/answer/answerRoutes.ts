import { Router, Request, Response } from "express";
import Container from "typedi";
import { validateRequestData, isObjectId } from "../../middleware/validation";
import { catchError } from "../../helpers";
import { AnswerController } from ".";
import decodeBearerToken from "../../middleware/decodeBearerToken";

const router = Router();
const answerCtrl = Container.get<AnswerController>("answer.controller");

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
  catchError(answerCtrl.create),
);

export default router;
