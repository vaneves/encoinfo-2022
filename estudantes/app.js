const express = require('express')
const app = express()
const PORTA = 9999
const knex = require('knex')
const config = require('./banco/knexfile')
const db = knex(config.development)

app.use(express.json())

app.get('/v1/estudantes', (req, res) => {
  db('estudantes')
    .orderBy('nome')
    .then((estudantes) => {
      res.send(estudantes)
    })
})

app.get('/v1/estudantes/:id', (req, res) => {
  db('estudantes')
    .where('id', req.params.id)
    .first()
    .then((estudante) => {
      if (estudante != null) {
        return res.send(estudante)
      }
      res.status(404)
        .send({
          erro: 'Estudante não encontrado'
        })
    })
})

app.post('/v1/estudantes', (req, res) => {
  const dados = req.body
  if (req.body.nome == null || req.body.email == null) {
    return res.status(400).send({erro: 'Preencha todos os campos'})
  }
  db('estudantes')
    .insert(dados)
    .returning('*')
    .then(([estudante]) => {
      res.send(estudante)
    })
})

app.listen(PORTA, () => {
  console.log(`Estudantes na porta ${PORTA}`)
})