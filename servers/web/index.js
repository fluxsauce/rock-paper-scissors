const http = require('http');
const app = require('./app');
const config = require('./config');
const logger = require('../shared/logger');

const server = http.Server(app);

server
  .listen(config.server.port)
  .on('listening', () => logger.info(`HTTP server listening on port ${config.server.port}`));
