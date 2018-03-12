const Chance = require('chance');

const chance = new Chance();

module.exports = class {
  constructor(input) {
    this.id = input.id || null;
    this.lastUpdated = new Date();
    this.name = input.name || chance.name();
  }
};
