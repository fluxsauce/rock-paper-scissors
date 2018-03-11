const knex = require('../../../lib/knex');
const joiSchemas = require('../../../lib/joiSchemas');

function create(raw) {
  return joiSchemas.Player.validate(raw)
    .then(validated => knex.insert(validated)
      .into('players'))
    .then((result) => {
      raw.id = result.pop();
      return raw;
    });
}

function get(id) {
  return knex('players')
    .where({ id })
    .select()
    .then((result) => {
      const player = result.pop();
      if (!(player.lastUpdated instanceof Date)) {
        this.lastUpdated = new Date(this.lastUpdated);
      }
      return player;
    });
}

module.exports = {
  create,
  get,
};
