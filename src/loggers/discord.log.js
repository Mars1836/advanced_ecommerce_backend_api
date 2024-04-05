"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { TOKEN_DISCORD } = process.env;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(TOKEN_DISCORD);
client.on("messageCreate", (msg) => {
  console.log(msg);
  if (msg.author.bot) {
    return;
  }
  if (msg.content === "hello") {
    msg.reply("Hello! how can I assits you");
  }
});
