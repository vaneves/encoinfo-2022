const express = require('express')
const app = express()
const knex = require('knex')
const config = require('./banco/knexfile')
const db = knex(config.development)

const PORTA = 7777

app.get('/', (req, res) => {
  res.send({
    nome: 'maria'
  })
})

app.get('/v1/cursos', (req, res) => {
  db('cursos')
    .orderBy('nome')
    .then((cursos) => {
      res.send(cursos)
    })
})

app.get('/v1/cursos/:id', (req, res) => {
  db('cursos')
    .where('id', req.params.id)
    .first()
    .then((curso) => {
      if (curso) {
        return res.send(curso)
      }
      res.status(404).send({erro: 'Curso não encontrado'})
    })
})

app.listen(PORTA, () => {
  console.log(`Servidor online na porta ${PORTA}`)
})
