const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 4000,
  },
  redisdb: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || "6379",
  },
};
const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 4000,
  },

  redisdb: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || "6379",
  },
};
const docker = {
  app: {
    port: process.env.PRO_APP_PORT || 4000,
  },

  redisdb: {
    host: process.env.DEV_DB_HOST || "redis",
    port: process.env.DEV_DB_PORT || "6379",
  },
};
const config = {
  pro,
  dev,
  docker,
};
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
