const express = require('express');

const app = express();

app.set('x-powered-by', false);

app.use(express.json());

app.use(require('./router'));

module.exports = app;
