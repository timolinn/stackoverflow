import { Router, Request, Response } from "express";
import Container from "typedi";
import { validateRequestData, isObjectId } from "../../middleware/validation";
import { catchError } from "../../helpers";
import { SearchController } from ".";
import decodeBearerToken from "../../middleware/decodeBearerToken";

const router = Router();
const searchCtrl = Container.get<SearchController>("search.controller");

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
  "/",
  catchError(searchCtrl.search),
);

export default router;
