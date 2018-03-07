const Moniker = require('moniker');

module.exports = class {
  constructor(input) {
    this.id = input.id || null;
    this.lastUpdated = new Date();
    this.name = input.name || Moniker.choose();
  }
};
