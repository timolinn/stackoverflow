import config from "../config";
import { logger } from "../util/logger";

/**
 * Copyright 2020 Timothy Onyiuke.
 * Adapted from https://google.github.io/styleguide/jsoncstyleguide.xml
 */
interface Response {
  apiVersion: string;
  status: string;
  message?: string;
}

interface Success<T> extends Response {
  data: DataResponse<T> | null;
}

interface ErrorResponse extends Response {
  error: APIError;
  stack?: any;
}

// Some properties were made optional for now. Should change in the future
// For example the startIndex is meant to tell the consumer which item id is first
// On the list to help calculate paging.
export interface DataResponse<T> {
  kind: string;
  startIndex?: number;
  itemsPerPage?: number; // For pagination, number of items in items array should not pass 10.
  totalItems?: number; // Eg. total number of document owned by user
  pageIndex?: number; // Typically `floor(startIndex / itemsPerpage) + 1`.
  totalPages?: number; // Typically 'ceil(totalItems / itemsPerPage)`. Helps the use know wher to jump
  nextLink?: string;
  previousLink?: string;
  items: Array<T>;
  meta?: Record<string, any>;
}

interface APIError {
  code: number;
  message: string;
  errors: Array<{ message?: string; domain?: string; reason?: string }> | [];
}

export const success = <T>(message: string, options: DataResponse<T>): Success<T> => {
  const { kind, startIndex, totalItems, nextLink, previousLink, items } = options;
  return {
    apiVersion: config.apiVersion,
    status: "success",
    message,
    data: {
      kind,
      // Uncomment after implementing pagination
      // StartIndex,
      // TotalItems,
      // NextLink,
      // PreviousLink,
      items: items ? items : [],
    },
  };
};

export const error = (
  message: string,
  code: number, errors?:
  {message?: string; reason?: string}[],
  stack?: any): ErrorResponse => {

  errors = !errors ? [] : errors;
  code = code > 600 ? 500 : code;
  const err = {
    apiVersion: config.apiVersion,
    status: "error",
    message,
    error: {
      code,
      message,
      errors,
    },
    stack,
  };

  logger.debug(err);
  return err;
};
