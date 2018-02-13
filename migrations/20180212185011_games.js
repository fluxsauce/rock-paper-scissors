module.exports.up = knex => knex.schema.createTable('games', (table) => {
  table.increments('id').unsigned().primary();
  table.dateTime('lastUpdated').notNull();
  table.integer('player1id');
  table.enum('player1choice', ['rock', 'paper', 'scissors']);
  table.integer('player2id');
  table.enum('player2choice', ['rock', 'paper', 'scissors']);
  table.enum('state', ['pending', 'final']).notNull();
});

module.exports.down = () => {};
