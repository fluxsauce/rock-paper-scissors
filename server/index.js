const http = require('http');
const config = require('config');
const app = require('./app');
const logger = require('./lib/logger');
const endpoints = require('express-list-endpoints');

const server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
  endpoints(app).forEach(endpoint => logger.info(endpoint));
}

server.listen(config.get('port'));
server.on('listening', () => logger.info(`HTTP server listening on port ${config.get('port')}`));
