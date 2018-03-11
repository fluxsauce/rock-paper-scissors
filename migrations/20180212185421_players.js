module.exports.up = knex => knex.schema.hasTable('players').then((exists) => {
  if (!exists) {
    return knex.schema.createTable('players', (table) => {
      table.increments('id').unsigned().primary();
      table.dateTime('lastUpdated').notNull();
      table.string('name', 32);
      table.string('sessionId', 32);

      table.engine('InnoDB');
      table.charset('utf8');
    });
  }
  return true;
});

module.exports.down = () => {};
