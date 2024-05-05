"use strict";
const { default: mongoose } = require("mongoose");
const { mongodb } = require("../configs/config.mongodb");
const connectString = `mongodb://${mongodb.host}:${mongodb.port}/${mongodb.name}`;
const connectStringdocker = `mongodb://${mongodb.host}:${mongodb.port}/${mongodb.name}`;
class Database {
  constructor() {
    this.connect();
  }
  connect() {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectStringdocker)
      .then((_) => {
        console.log(connectStringdocker);
        console.log("Connected mongodb success!!!");
      })
      .catch((err) => {
        console.log("Error Connect: " + err);
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
