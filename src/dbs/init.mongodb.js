"use strict";
const { default: mongoose } = require("mongoose");
const { db } = require("../configs/config.mongodb");
const connectString = `mongodb://${db.host}:${db.port}/${db.name}`;
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
      .connect(connectString)
      .then((_) => {
        console.log(connectString);
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
