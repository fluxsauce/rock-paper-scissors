const config = require('config');
const knex = require('../../../lib/knex')(config);
const validation = require('../../../lib/validation');
const Player = require('./Player');

/**
 * Create a player.
 *
 * @param {Object} raw - player to be created.
 * @returns {Promise<Player>} Player populated with an id.
 */
function create(raw) {
  return validation.Player.validate(raw)
    .then(validated => knex.insert(validated)
      .into('players'))
    .then((result) => {
      raw.id = result.pop();
      return new Player(raw);
    });
}

/**
 * Get a player by ID.
 *
 * @param {integer} id - target identifier.
 * @returns {Promise<Player>} Database result.
 */
function get(id) {
  return knex('players')
    .where({ id })
    .select()
    .then((result) => {
      if (result.length > 0) {
        return new Player(result.pop());
      }
      return null;
    });
}

module.exports = {
  create,
  get,
};
