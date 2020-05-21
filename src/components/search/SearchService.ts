import { Service } from "typedi";
import es from "@elastic/elasticsearch";
import { LoggerInterface } from "../../util/logger";
import { errorHandler } from "../../handlers/error";
import config from "../../config";

@Service("search.service")
export class SearchService {
  private es: es.Client;
  constructor(private logger: LoggerInterface) {
    // TODO: use a factory class to make mocking easier
    this.es = new es.Client(
      {
        node: config.elasticsearch.url,
        maxRetries: config.elasticsearch.maxRetries,
      },
    );
  }

  /**
   * This method indexes data into elastic search
   * @param indexName name of index
   * @param data data object to be index in elastic search
   */
  public async index(indexName: string, data: any) {
    const res = await this.es.index(
      {
        index: indexName,
        id: data.id,
        body: data,
        type: indexName,
        refresh: "true",
      },
    ).catch(errorHandler.handleError);
    this.logger.info(`${data} indexed to "${indexName}" index elastic search`);
    return res;
  }

  /**
   * removes indexed data from elastic search
   * @param indexName name of index
   * @param dataid id of indexed data to remove
   */
  public async remove(indexName: string, dataid: string) {
    const res = await this.es.delete(
      { index: indexName, id: dataid, refresh: "true" },
    ).catch(errorHandler.handleError);
    this.logger.info(`${dataid} removed from ${indexName}`);
    return res;
  }

  // curl -X POST "localhost:9200/twitter/_search?routing=kimchy&pretty" -H 'Content-Type: application/json' -d'
  // {
  //   "query": {
  //       "bool" : {
  //           "must" : {
  //               "query_string" : {
  //                   "query" : "some query string here"
  //               }
  //           },
  //           "filter" : {
  //               "term" : { "user" : "kimchy" }
  //           }
  //       }
  //   }
  // }
  // '

  public async query(index: string, searchQuery: string) {
    const res: any = await this.es.search({
      index,
      body: {
        query: {
          bool: {
            must: {
              // eslint-disable-next-line camelcase
              query_string: {
                query: searchQuery,
              },
            },
          },
        },
      },
    }).catch(err => {
      throw err;
    });
    return res.body.hits.hits;
  }
}
