const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 4000,
  },
  mongodb: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || "27017",
    name: process.env.DEV_DB_NAME || "shopDEV",
  },
};
const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 4000,
  },
  mongodb: {
    host: process.env.PRO_DB_HOST || "mongodb-myapp",
    port: process.env.PRO_DB_PORT || "27017",
    name: process.env.PRO_DB_NAME || "shopPRO",
  },
};
const docker = {
  app: {
    port: process.env.PRO_APP_PORT || 4000,
  },
  mongodb: {
    host: process.env.PRO_DB_HOST || "mongo",
    port: process.env.PRO_DB_PORT || "27017",
    name: process.env.PRO_DB_NAME || "shopDEV",
  },
};
const config = {
  pro,
  dev,
  docker,
};
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
