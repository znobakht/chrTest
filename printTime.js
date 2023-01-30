import logger from "./logger.js";
export const printTime = () => {
  let date = new Date();
  console.log(date.getHours());
  logger.info(date.getHours());
  console.log(date.getMinutes());
  logger.info(date.getMinutes())
};
