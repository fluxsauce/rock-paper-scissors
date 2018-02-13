const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [new (winston.transports.Console)()],
});
logger.stream = {
  write: logger.info,
};

module.exports = logger;
