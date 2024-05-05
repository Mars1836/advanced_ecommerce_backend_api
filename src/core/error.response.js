const { ReasonPhrases } = require("http-status-codes");
const { StatusCodes } = require("http-status-codes/build/cjs/status-codes");
const logger = require("../loggers/winston");

const ERRORS = {
  FORBIDDEN: {
    status: 403,
    message: "Bad request error",
  },
  CONFLICT: {
    status: 409,
    message: "Conflict error",
  },
};
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.time = Date.now();
  }
}
class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ERRORS.CONFLICT.message,
    status = ERRORS.CONFLICT.status
  ) {
    super(message, status);
  }
}
class BadRequestError extends ErrorResponse {
  constructor(
    message = ERRORS.FORBIDDEN.message,
    status = ERRORS.FORBIDDEN.status
  ) {
    super(message, status);
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    status = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    status = StatusCodes.FORBIDDEN
  ) {
    super(message, status);
  }
}
class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    status = StatusCodes.NOT_FOUND
  ) {
    super(message, status);
  }
}
const errorClasses = {
  ErrorResponse,
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
};
module.exports = errorClasses;
