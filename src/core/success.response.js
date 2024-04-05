const SUCCESSES = {
  OK: {
    status: 200,
    message: "Success",
  },
  CREATE: {
    status: 201,
    message: "Created",
  },
};
class SuccessResponse {
  constructor({
    message,
    status = SUCCESSES.OK.status,
    metadata = {},
    options = {},
  }) {
    this.message = message;
    this.status = status;
    this.metadata = metadata;
    this.options = options;
  }
  send = (res) => {
    res.status(this.status).json(this);
  };
}
class OkRequestSuccess extends SuccessResponse {
  constructor({
    message = SUCCESSES.OK.message,
    status = SUCCESSES.OK.status,
    metadata = {},
    options = {},
  }) {
    super({ message, status, metadata, options });
  }
}
class CreateRequestSuccess extends SuccessResponse {
  constructor({
    message = SUCCESSES.CREATE.message,
    status = SUCCESSES.CREATE.status,
    metadata = {},
    options = {},
  }) {
    super({ message, status, metadata, options });
  }
}
const successClass = {
  SuccessResponse,
  OkRequestSuccess,
  CreateRequestSuccess,
};
module.exports = successClass;
