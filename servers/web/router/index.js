const config = require('config');
const express = require('express');
const request = require('request');

const router = new express.Router();

router.get('/', (req, res) => {
  const options = {
    method: 'GET',
    headers: {
      'X-Request-Id': req.id,
    },
  };
  request(`http://localhost:${config.get('games.port')}/api/v1/games`, options, (error, response, body) => {
    try {
      const games = JSON.parse(body);
      res.render('index', {
        games,
      });
    } catch (e) {
      res.status(500).send(error.message);
    }
  });
});

module.exports = router;
