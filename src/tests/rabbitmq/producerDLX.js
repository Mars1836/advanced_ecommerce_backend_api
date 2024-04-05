const amqp = require("amqplib");
const rabbit_url = "amqp://localhost:5672";
const sendNoti = async () => {
  const exchangeNameMain = "notification_exchange";
  const queueNameMain = "notification_queue";
  const exchangeNameDLX = "notification_dlx_exchange";
  const routingKeyDLX = "routing_key_DLX";
  const connection = await amqp.connect(rabbit_url);
  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeNameMain, "direct", { durable: true });

  await channel.assertQueue(queueNameMain, {
    exclusive: false,
    deadLetterExchange: exchangeNameDLX,
    deadLetterRoutingKey: routingKeyDLX,
  });
  const msg = "Hello world";
  await channel.sendToQueue(queueNameMain, Buffer.from(msg), {
    expiration: 5000,
  });
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};
sendNoti();
