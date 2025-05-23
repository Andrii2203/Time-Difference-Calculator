const winston = require('winston');

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        }),
    ),
    transports: [
        new winston.transports.File({ filename: "server.log" })
    ]
});

module.exports = logger;