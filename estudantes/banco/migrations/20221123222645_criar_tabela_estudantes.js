
exports.up = function(knex) {
  return knex.schema
    .createTable('estudantes', (tabela) => {
      tabela.increments()
      tabela.string('nome')
      tabela.string('email')
    })
};


exports.down = function(knex) {
  return knex.schema.dropTable('estudantes')
};
