const config = require('./config');
const express = require('express');
const playersClient = require('./lib/playersClient')(config.players);
const path = require('path');
const session = require('./session');

const app = express();

app.set('x-powered-by', false);

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

// Specify node_modules location if not set from environment variables.
if (!('NODE_PATH' in process.env)) {
  process.env.NODE_PATH = path.resolve(__dirname, '../../node_modules');
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap/css', express.static(path.join(process.env.NODE_PATH, '/bootstrap/dist/css')));
app.use('/bootstrap/js', express.static(path.join(process.env.NODE_PATH, '/bootstrap/dist/js')));
app.use('/jquery/js', express.static(path.join(process.env.NODE_PATH, '/jquery/dist')));
app.use('/popper/js', express.static(path.join(process.env.NODE_PATH, '/popper.js/dist/umd')));

app.use(session);

app.use(async (request, response, next) => {
  if (request.session.playerId) {
    return next();
  }
  const result = await playersClient.create();
  request.session.playerId = result.body.id;
  return next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('./router'));

module.exports = app;
