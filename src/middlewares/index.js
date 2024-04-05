const loggerService = require("../loggers/discord.log.v2");
const logToDiscord = async (req, res, next) => {
  await loggerService.sendToFormatCode({
    title: `Method: ${req.method}`,
    code: req.method === "GET" ? req.query : req.body,
    message: req.protocol + "://" + req.get("host") + req.originalUrl,
  });
  console.log("url:  ", req.headers.referrer || req.headers.referer);

  return next();
};
const midlewares = {
  logToDiscord,
};
module.exports = midlewares;
