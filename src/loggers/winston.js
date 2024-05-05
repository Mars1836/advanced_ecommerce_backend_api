const winston = require("winston");
const { v4: uuidv4 } = require("uuid");

const { combine, timestamp, align, printf, json, colorize } = winston.format;
require("winston-daily-rotate-file");
const printfFormat = printf(
  ({ level, message, requestId, status, timestamp, metadata }) => {
    return `${timestamp}::${level}::${requestId}::${message}::${JSON.stringify(
      metadata
    )}`;
  }
);
const filterLevel = (level) => {
  return winston.format((log, opts) => {
    return log.level === level ? log : false;
  });
};

const combineFn = (levelFilter) => {
  return levelFilter
    ? combine(
        filterLevel(levelFilter),
        timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS A",
        }),
        align(),
        printfFormat
      )
    : combine(
        timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS A",
        }),
        align(),
        printfFormat
      );
};
class Logger {
  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: combineFn(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          // filename: "app-error-%DATE%.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "2d",
          level: "error",
          dirname: "logs",
        }),
        new winston.transports.DailyRotateFile({
          // filename: "app-info-%DATE%.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "2d",
          level: "info",
          dirname: "logs",
        }),
      ],
    });
  }
  commonParams(params) {
    let context, req, requestId, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }
    return { context, requestId: req.requestId || uuidv4(), metadata };
  }
  error(message, params) {
    console.log("000))))))))))))))))))))");
    this.logger.error({ message, ...this.commonParams(params) });
  }
  info(message, params) {
    this.logger.info({ message, ...this.commonParams(params) });
  }
}
// const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || "info",
//   format: combineFn(),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.DailyRotateFile({
//       // filename: "app-error-%DATE%.log",
//       datePattern: "YYYY-MM-DD-HH",
//       zippedArchive: true,
//       maxSize: "20m",
//       maxFiles: "2d",
//       level: "error",
//       dirname: "logs",
//       // format: combine(errorFilter, timestamp(), json()),
//     }),
//     new winston.transports.DailyRotateFile({
//       // filename: "app-info-%DATE%.log",
//       datePattern: "YYYY-MM-DD-HH",
//       zippedArchive: true,
//       maxSize: "20m",
//       maxFiles: "2d",
//       level: "info",
//       dirname: "logs",
//       // format: combine(infoFilter, timestamp(), json()),
//     }),
//   ],
// });
module.exports = new Logger();
