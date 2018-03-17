const app = require('./app');
const http = require('http');
const config = require('config');

const server = http.Server(app);

const port = config.get('web.port');

server
  .listen(port);
