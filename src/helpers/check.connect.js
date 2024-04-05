const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;
function countConnect() {
  const num = mongoose.connections.length;
  console.log("Number of connection: " + num);
}
function checkOverload() {
  setInterval(() => {
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage.rss();
    const numcOfConnection = mongoose.connections.length;
    const maxConnection = numCores * 10;
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    console.log(`Num of connection: ${numcOfConnection}`);
    if (numcOfConnection > maxConnection) {
      console.log("Connection overload detected!");
    }
  }, _SECOND);
}
module.exports = { countConnect, checkOverload };
