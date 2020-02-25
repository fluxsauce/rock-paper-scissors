const morgan = require('morgan');
const logger = require('./logger');

morgan.token('requestId', (request) => request.id);

const format = ':requestId :method :url :status :response-time ms';
const options = {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
};

module.exports = morgan(format, options);
