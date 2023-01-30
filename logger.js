import { createLogger, transports, format } from "winston";

const logger = createLogger({
  level: "debug",
  format: format.json(),
  //   transports: [new winston.transports.Console()],
  transports: [
    //new transports:
    new transports.File({
      filename: "logs/example.log",
    }),
  ],
});

export default logger;