const dev = {
  host: process.env.RABBIT_MQ_DEV_HOST || "localhost",
  port: process.env.RABBIT_MQ_DEV_PORT || "5672",
  scheme: process.env.RABBIT_MQ_DEV_AMQP || "amqp",
  get connection() {
    return `${this.scheme}://${this.host}:${this.port}`;
  },
};
const pro = {
  host: process.env.RABBIT_MQ_DEV_HOST || "localhost",
  port: process.env.RABBIT_MQ_DEV_PORT || "5672",
  scheme: process.env.RABBIT_MQ_DEV_AMQP || "amqp",
};
const rabbitmqConfig = {
  dev,
  pro,
};
