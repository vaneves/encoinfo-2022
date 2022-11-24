
exports.seed = async function(knex) {
  
  await knex('estudantes').del()
  await knex('estudantes').insert([
    {nome: 'Paulo', email: 'paulo@gmail.com'},
    {nome: 'Fábio', email: 'fabio@gmail.com'},
    {nome: 'Maria', email: 'maria@gmail.com'},
    {nome: 'Julia', email: 'julia@gmail.com'},
    {nome: 'Jorge', email: 'jorge@gmail.com'},
  ]);
};
