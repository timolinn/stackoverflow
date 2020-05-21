import { Router } from "express";
import AuthCtrl from "./AuthController";
import { catchError } from "../../helpers";
import { Container } from "typedi";
import { validateRequestData } from "../../middleware/validation";
import decodeBearerToken from "../../middleware/decodeBearerToken";

const authCtrl = Container.get<AuthCtrl>("auth.controller");
const router = Router();

/**
 * @swagger
 * /auth/signin:
 *  post:
 *    security:
 *    description: sign's in a user. returns a JWT token which the user must send via the header in subsequent requests.
 *    summary: sign's in a user
 *    tags:
 *      - Auth
 *    produces:
 *       - application/json
 *    requestBody:
 *      content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *    responses:
 *       200:
 *         description: login
 */
router.post("/signin", validateRequestData, catchError(authCtrl.signIn));

/**
 * @swagger
 * /auth/forgotPassword:
 *  post:
 *    security:
 *    description: sends reset password link
 *    summary: send a reset password link via email
 *    tags:
 *      - Auth
 *    produces:
 *       - application/json
 *    parameters:
 *       - name: email
 *         in: formData
 *         required: true
 *         type: string
 *    responses:
 *       200:
 *         description: signin
 */
router.post(
  "/password/forgot",
  validateRequestData,
  catchError(authCtrl.forgotPassword),
);

/**
 * @swagger
 * /auth/resetPassword:
 *  post:
 *    security:
 *    description: Resets user's password
 *    summary: resets user's password
 *    tags:
 *      - Auth
 */
router.patch(
  "/password/reset",
  validateRequestData,
  decodeBearerToken,
  catchError(authCtrl.resetPassword),
);

/**
 * @swagger
 * /auth/resetPassword:
 *  post:
 *    security:
 *    description: Resets user's password
 *    summary: resets user's password
 *    tags:
 *      - Auth
 */
router.post("/logout", catchError(authCtrl.logOut));

/**
 * @swagger
 * /auth/resetPassword:
 *  post:
 *    security:
 *    description: Resets user's password
 *    summary: resets user's password
 *    tags:
 *      - Auth
 */
router.post("/blacklist", catchError(authCtrl.blacklistJWT));

export default router;
