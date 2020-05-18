import { HttpCode } from "../http";

export class AppError extends Error {
  public readonly name: string;
  public readonly code: HttpCode;
  public readonly isOperational: boolean;

  constructor(name: string, code: HttpCode,
              public readonly options: { description: string; isOperational?: boolean }
  ) {
    super(options.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.code = code;
    this.isOperational = options.isOperational || false;

    Error.captureStackTrace(this);
  }
}
