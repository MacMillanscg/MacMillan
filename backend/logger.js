const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log" }), // For persistent logs
  ],
});

module.exports = logger;
