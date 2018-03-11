const knex = require('../../../lib/knex');
const merge = require('lodash/merge');
const Game = require('./Game');
const joiSchemas = require('../../../lib/joiSchemas');

function fetch() {
  return knex('games');
}

function create(raw) {
  let game;

  return joiSchemas.Game.validate(raw)
    .then((validated) => {
      game = validated;

      return knex
        .insert(game)
        .into('games');
    })
    .then((result) => {
      game.id = result.pop();
      return new Game(game);
    });
}

function get(id) {
  return knex('games')
    .where({ id })
    .select()
    .then((result) => {
      if (result.length > 0) {
        const game = new Game(result.pop());
        game.lastUpdated = new Date(game.lastUpdated);
        return game;
      }
      return null;
    });
}

function update(original, raw) {
  let game = merge(original, raw);
  game.lastUpdated = new Date();

  return joiSchemas.Game.validate(game)
    .then((validated) => {
      game = validated;

      return knex('games')
        .where({ id: game.id })
        .update(game);
    })
    .then(() => new Game(game));
}

module.exports = {
  fetch,
  create,
  get,
  update,
};
