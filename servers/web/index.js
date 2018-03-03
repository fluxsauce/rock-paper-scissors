const http = require('http');
const config = require('config');
const app = require('./app');
const logger = require('../../lib/logger');

const port = config.get('web.port');

http.createServer(app)
  .listen(port)
  .on('listening', () => logger.info(`HTTP server listening on port ${port}`));
