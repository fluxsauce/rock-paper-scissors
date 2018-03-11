const app = require('./app');
const http = require('http');
const config = require('config');
const logger = require('../../lib/logger');

const server = http.Server(app);

const port = config.get('web.port');

server
  .listen(port)
  .on('listening', () => logger.info(`HTTP server listening on port ${port}`));
