"use strict";
const { default: mongoose } = require("mongoose");

const connectString = "mongodb://localhost:27017/shopDEV";
mongoose
  .connect(connectString)
  .then((_) => console.log("Connected mongodb success!!"))
  .catch((err) => {
    console.log("Error Connect: " + err);
  });
if (1 === 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}
module.exports = mongoose;
