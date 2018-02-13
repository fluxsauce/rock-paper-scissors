module.exports.up = (knex) => {
  knex.schema.hasTable('players').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('players', (table) => {
        table.increments('id').unsigned().primary();
        table.dateTime('lastUpdated').notNull();
        table.string('name', 32);
      });
    }
    return Promise.resolve(true);
  });
};

module.exports.down = () => {};
