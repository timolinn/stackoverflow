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
 * components:
 *    schemas:
 *      question:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *          body:
 *            type: string
 *          tags:
 *            type: array
 *          user:
 *            type: object
 *          comments:
 *            type: array
 */

/**
 * @swagger
 * /questions:
 *  post:
 *    description: This endpoint creates a new question document
 *    summary: Creates a new question
 *    parameters:
 *      - name: Bearer token
 *        in: Header
 *        required: true
 *        schema:
 *          type: string
 *      - name: title
 *        description: contains the question's title or header
 *        in: body
 *        required: true
 *        schema:
 *          type: string
 *      - name: body
 *        description: full question text
 *        in: body
 *        required: true
 *        schema:
 *          type: string
 *      - name: tags
 *        description: platform tags
 *        in: body
 *        required: true
 *        schema:
 *          type: arrayType
 *    produces:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *            status:
 *              type: string
 *              message:
 *                type: string
 *              data:
 *                type: object
 *                properties:
 *                  apiVersion:
 *                    type: Integer
 *    responses:
 *      '201':
 *        description: returns created question
 *      '401':
 *        description: unauthorized
 *    tags:
 *      - questions
 */
router.post(
  "/",
  decodeBearerToken,
  validateRequestData,
  catchError(questionCtrl.create),
);

/**
 * @swagger
 * /questions/{questionID}:
 *  get:
 *    description: Returns the question with specified questionID
 *    summary: Get a question by it's ID
 *    responses:
 *      '200':
 *         description: returns question object
 *      '404':
 *          description: returns empty object if not found
 *    tags:
 *      - questions
 */
router.get(
  "/:questionId",
  isObjectId("questionId"),
  catchError(questionCtrl.get),
);

/**
 * @swagger
 * /questions/{questionID}/upvote:
 *  post:
 *    description: This endpoint enables a user upvote a question
 *    summary: Upvote question
 *    parameters:
 *      - name: Bearer token
 *        in: Header
 *        required: true
 *        schema:
 *          type: string
 *    tags:
 *      - questions
 */
router.post(
  "/:questionId/upvote",
  isObjectId("questionId"),
  decodeBearerToken,
  catchError(questionCtrl.upvote),
);

/**
 * @swagger
 * /questions/{questionID}/downvote:
 *  post:
 *    description: This endpoint enables a user downvote a question
 *    summary: Downvote question
 *    parameters:
 *      - name: Bearer token
 *        in: Header
 *        required: true
 *        schema:
 *          type: string
 *    tags:
 *      - questions
 */
router.post(
  "/:questionId/downvote",
  isObjectId("questionId"),
  decodeBearerToken,
  catchError(questionCtrl.downvote),
);

export default router;
