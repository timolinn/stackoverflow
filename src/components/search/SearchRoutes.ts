import { Router } from "express";
import Container from "typedi";
import { catchError } from "../../helpers";
import { SearchController } from ".";

const router = Router();
const searchCtrl = Container.get<SearchController>("search.controller");

/**
 * @swagger
 * /search:
 *  post:
 *    description: This endpoint enables a user search the database.
 *    summary: Search
 *    parameters:
 *      - name: query
 *        in: query_string
 *        required: true
 *        schema:
 *          type: string
 *    tags:
 *      - search
 */
router.get(
  "/",
  catchError(searchCtrl.search),
);

export default router;
