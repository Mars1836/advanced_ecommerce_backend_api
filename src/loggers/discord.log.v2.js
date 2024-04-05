const { TOKEN_DISCORD, CHANNEL_ID_DISCORD } = process.env;
const { Client, GatewayIntentBits } = require("discord.js");

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.channelId = CHANNEL_ID_DISCORD;
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.login(TOKEN_DISCORD);
  }
  async sendToFormatCode(logData) {
    const {
      code,
      message = "This is some additional information aobout code",
      title = "Code format",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }
  async sendToMessage(message = "message") {
    console.log(this.channelId);

    const channel = await this.client.channels.fetch(this.channelId);
    if (!channel) {
      console.error("Couldn't find the channel...", this.channelId);
      return false;
    }
    channel.send(message);
  }
}
module.exports = new LoggerService();
