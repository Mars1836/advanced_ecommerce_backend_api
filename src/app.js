const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverload } = require("./helpers/check.connect.js");
const { logToDiscord } = require("./middlewares/index.js");
const cors = require("cors");
const redisClientIn = require("./redis/index.js");
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
// init db
// checkOverload();
require("./dbs/init.mongodb.js");
// init routes

app.use("/", require("./routes"));
// handleing error
module.exports = app;
