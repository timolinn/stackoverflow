import { Router } from "express";
import Container from "typedi";
import { validateRequestData } from "../../middleware/validation";
import { catchError } from "../../helpers";
import { AnswerController } from ".";
import decodeBearerToken from "../../middleware/decodeBearerToken";

const router = Router();
const answerCtrl = Container.get<AnswerController>("answer.controller");

/**
 * @swagger
 * /answers:
 *  post:
 *    description: This endpoint creates a new answer document that is attached to a question
 *    summary: creates a new answer document
 *    produces:
 *       - application/json
 *    parameters:
 *      - name: Bearer token
 *        in: Header
 *        required: true
 *        schema:
 *          type: string
 *      - name: text
 *        description: contains the user's answer
 *        in: body
 *        required: true
 *        schema:
 *          type: string
 *      - name: question
 *        description: this should be a mongodb objectId that represent's the question
 *        in: body
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: The Question
 *    tags:
 *      - answers
 */
router.post(
  "/",
  decodeBearerToken,
  validateRequestData,
  catchError(answerCtrl.create),
);

export default router;
