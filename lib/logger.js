const config = require('config');
const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [new (winston.transports.Console)()],
});
logger.stream = {
  write: logger.info,
};
logger.level = config.get('logger.level');

module.exports = logger;
