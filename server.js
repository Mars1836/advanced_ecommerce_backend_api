require("dotenv").config();
const app = require("./src/app");
const server = app.listen(process.env.PORT, () => {
  console.log("server running in port : " + process.env.PORT || 4000);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server express");
  });
});
