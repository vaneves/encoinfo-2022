exports.seed = async function(knex) {
  await knex('cursos').del()
  await knex('cursos').insert([
    {id: 1, nome: 'Curso 1', quantidadeVagas: 5},
    {id: 2, nome: 'Curso 2', quantidadeVagas: 3},
    {id: 3, nome: 'Curso 3', quantidadeVagas: 9}
  ]);
};
