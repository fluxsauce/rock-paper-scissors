const knex = require('./knex');
const merge = require('lodash/merge');

module.exports = class {
  constructor(input) {
    this.id = input.id || null;
    this.lastUpdated = new Date();
    this.player1id = input.player1 || null;
    this.player1Choice = input.player1Choice || null;
    this.player2id = input.player2 || null;
    this.player2Choice = input.player2Choice || null;
    this.state = input.state || 'pending';
  }

  create() {
    return knex
      .insert(this)
      .into('games')
      .then((result) => {
        this.id = result.pop();
        return this;
      });
  }

  get() {
    return knex('games')
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

  update(input) {
    merge(this, input);
    this.lastUpdated = new Date();
    return knex('games')
      .where({ id: this.id })
      .update(input)
      .then(() => this);
  }
};
