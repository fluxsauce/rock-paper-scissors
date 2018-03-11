const knex = require('../../../lib/knex');
const merge = require('lodash/merge');
const Game = require('./Game');
const validation = require('../../../lib/validation');

function fetch(criteria) {
  const query = knex.select().from('games');
  if (criteria.state) {
    query.where('state', criteria.state);
  }
  if (criteria.limit) {
    query.limit(criteria.limit);
  }
  if (criteria.order) {
    query.orderBy('id', criteria.order);
  }
  return query;
}

function create(raw) {
  let game;

  return validation.Game.validate(raw)
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

  return validation.Game.validate(game)
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
