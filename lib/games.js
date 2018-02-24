const knex = require('./knex');
const merge = require('lodash/merge');
const Game = require('./Game');
const GameConstraint = require('./constraints/Game');

function fetch() {
  return knex('games');
}

function create(raw) {
  let game;

  return GameConstraint.validate(raw)
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
      const game = result.pop();
      game.lastUpdated = new Date(game.lastUpdated);
      return new Game(game);
    });
}

function update(original, raw) {
  let game = merge(original, raw);
  game.lastUpdated = new Date();

  return GameConstraint.validate(game)
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
