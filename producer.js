const amqp = require("amqplib");
require("dotenv").config();
class Producer {
  channel;
  constructor() {
    this.exchangeName = "exchange1";
  }
  async createChannel() {
    const connection = await amqp.connect(process.env.AMPQ_URL_DOCKER);
    this.channel = await connection.createChannel();
  }

  async publicMessage(payload) {
    const logDetails = {
      logType: "notification",
      payload: payload,
      dateTime: new Date(),
    };
    await this.channel.assertExchange(this.exchangeName, "direct", {
      durable: true,
    });
    await this.channel.publish(
      this.exchangeName,
      "notification",
      Buffer.from(JSON.stringify(payload))
    );
    console.log(
      `The new notification log is sent to exchange ${this.exchangeName}`
    );
  }
}
module.exports = Producer;
