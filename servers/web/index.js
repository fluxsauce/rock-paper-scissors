const app = require('./app');
const http = require('http');
const config = require('./config');

const server = http.Server(app);

server
  .listen(config.server.port);
