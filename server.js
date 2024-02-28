const app = require("./src/app");
const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log("server running in port : " + PORT);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server express");
  });
});
