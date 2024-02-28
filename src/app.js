const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();
// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// init db

// init routes
app.get("/", (req, res, next) => {
  res.status(200).send("This is message!");
});
// handleing error
module.exports = app;
