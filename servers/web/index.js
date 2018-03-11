const app = require('./app');
const get = require('lodash/get');
const has = require('lodash/has');
const http = require('http');
const config = require('config');
const logger = require('../../lib/logger');
const session = require('./session');

const server = http.Server(app);
const io = require('socket.io')(server);

app.set('socketio', io);

io.use((socket, next) => session(socket.request, socket.request.res, next));

const port = config.get('web.port');

server
  .listen(port)
  .on('listening', () => logger.info(`HTTP server listening on port ${port}`));

io.on('connection', (socket) => {
  if (has(socket, 'handshake.query.gameId')) {
    socket.join(get(socket, 'handshake.query.gameId'));
  }

  logger.info(`Client connected ${socket.request.session.id}`);
  socket.emit('connected', { response: 'connection', session: socket.request.session });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected ${socket.request.session.id}`);
  });
});
