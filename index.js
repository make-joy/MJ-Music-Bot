require("dotenv").config();
const MAKEJOY = require("./handlers/Client");
const { TOKEN } = require("./settings/config");

const client = new MAKEJOY();

module.exports = client;

client.start(TOKEN);

process.on("unhandledRejection", (reason, p) => {
  console.log(" [핸들링 에러] :: Unhandled Rejection/Catch");
  console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
  console.log(" [핸들링 에러] :: Uncaught Exception/Catch");
  console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(" [핸들링 에러] :: Uncaught Exception/Catch (MONITOR)");
  console.log(err, origin);
});