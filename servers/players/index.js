const http = require('http');
const config = require('./config');
const app = require('./app');

const server = http.createServer(app);

server
  .listen(config.server.port);
