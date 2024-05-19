const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverload } = require("./helpers/check.connect.js");
const { logToDiscord } = require("./middlewares/index.js");
const cors = require("cors");
const redisClientIn = require("./redis/index.js");
const { v4: uuidv4 } = require("uuid");
const logger = require("./loggers/winston.js");

const app = express();

// init middlewares
app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//init log
app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || uuidv4();
  req.requestId = requestId;
  logger.info(`input params::${req.method}::`, [
    req.originalUrl, //contact
    { requestId }, //requestId
    req.method === "POST" ? req.body : req.query, //metadata
  ]);
  next();
});

// init db
// checkOverload();
require("./dbs/init.mongodb.js");
// init routes

app.use("/", require("./routes"));
// handleing error
module.exports = app;
