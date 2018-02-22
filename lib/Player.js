const knex = require('./knex');
const merge = require('lodash/merge');
const Moniker = require('moniker');
const PlayerConstraint = require('./constraints/Player');

module.exports = class {
  constructor(input) {
    this.id = input.id || null;
    this.lastUpdated = new Date();
    this.name = input.name || Moniker.choose();
  }

  create() {
    return PlayerConstraint.validate(this)
      .then(validated => knex.insert(validated)
        .into('players'))
      .then((result) => {
        this.id = result.pop();
        return this;
      });
  }

  get() {
    return knex('players')
      .where({ id: this.id })
      .select()
      .then((result) => {
        merge(this, result.pop());
        if (!(this.lastUpdated instanceof Date)) {
          this.lastUpdated = new Date(this.lastUpdated);
        }
        return this;
      });
  }
};
