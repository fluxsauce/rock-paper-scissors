const http = require('http');
const config = require('config');
const app = require('./app');
const logger = require('../../lib/logger');

const server = http.createServer(app);

server.listen(config.get('port'));
server.on('listening', () => logger.info(`HTTP server listening on port ${config.get('port')}`));
