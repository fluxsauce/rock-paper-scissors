const config = require('config');
const express = require('express');
const playersClient = require('../../lib/playersClient')(config);
const path = require('path');
const session = require('./session');

const app = express();

app.set('x-powered-by', false);

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap/css', express.static('./node_modules/bootstrap/dist/css'));
app.use('/bootstrap/js', express.static('./node_modules/bootstrap/dist/js'));
app.use('/jquery/js', express.static('./node_modules/jquery/dist'));
app.use('/popper/js', express.static('./node_modules/popper.js/dist/umd'));
app.use('/socket/js', express.static('./node_modules/socket.io-client/dist'));

app.use(session);

app.use(async (request, response, next) => {
  if (request.session.playerId) {
    return next();
  }
  const result = await playersClient.create();
  request.session.playerId = result.body.id;
  request.session.playerName = result.body.name;
  return next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('./router'));

module.exports = app;
