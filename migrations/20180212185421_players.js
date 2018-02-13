module.exports.up = knex => knex.schema.createTable('players', (table) => {
  table.increments('id').unsigned().primary();
  table.dateTime('lastUpdated').notNull();
  table.string('name', 32);
});

module.exports.down = () => {};
