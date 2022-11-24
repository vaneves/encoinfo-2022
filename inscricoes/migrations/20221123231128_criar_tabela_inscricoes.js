exports.up = function(knex) {
  return knex.schema
    .createTable('inscricoes', (tabela) => {
      tabela.increments()
      tabela.integer('curso_id')
      tabela.integer('estudante_id')
      tabela.string('estudante_nome')
      tabela.string('status')
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('inscricoes')
};
