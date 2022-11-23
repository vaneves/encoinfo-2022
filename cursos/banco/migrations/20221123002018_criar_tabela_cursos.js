exports.up = function(knex) {
  return knex.schema
    .createTable('cursos', (tabela) => {
      tabela.increments()
      tabela.string('nome')
      tabela.integer('quantidadeVagas')
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('cursos')
};
