import { Service, Inject } from "typedi";
import { Request, Response, NextFunction } from "express";
import { SearchService } from ".";
import { LoggerInterface } from "../../util/logger";
import { StatusCodes } from "../../handlers/http";
import { success } from "../../middleware/response";

@Service("search.controller")
export class SearchController {
  constructor(
    @Inject("search.service") private searchService: SearchService,
    @Inject("logger") private logger: LoggerInterface,
  ) {
  }

  public search = async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line prefer-const
    let { query, index } = req.query; // search query
    if (!index) index = "*";
    const result = await this.searchService.query(index, query);
    return res.status(StatusCodes.OK).json(
      success("search results", { kind: "Search", items: [result] }),
    );
  };
}
