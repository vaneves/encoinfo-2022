const express = require('express')
const app = express()
const PORTA = 4444
const knex = require('knex')
const config = require('./knexfile')
const db = knex(config.development)
const axios = require('axios')
const amqplib = require('amqplib')

const URL_AMQP = 'amqps://pazvandg:mAeMqEt-s2R7bm2YCxiXAh2AIqJchX1v@jackal.rmq.cloudamqp.com/pazvandg'

app.use(express.json())

app.get('/v1/inscricoes/:idCurso', (req, res) => {
  db('inscricoes')
    .where('curso_id', req.params.idCurso)
    .orderBy('id')
    .then((inscricoes) => {
      res.send(inscricoes)
    })
})

app.post('/v1/inscricoes/:idCurso', async (req, res) => {
  const dados = req.body
  if (dados.estudante_id == null) {
    return res.status(400).send({erro: 'Faltou estudante_id'})
  }
  dados.curso_id = req.params.idCurso

  const conexao = await amqplib.connect(URL_AMQP)
  const canal = await conexao.createChannel()
  const FILA = 'fila_inscricao'
  const mensagem = JSON.stringify(dados)

  var exchange = 'aaaaa';
  var rkey = 'bbb';
  await canal.assertExchange(exchange, 'direct', {durable: true})
  await canal.assertQueue(FILA, {durable: true});
  await canal.bindQueue(FILA, exchange, rkey);
  await canal.publish(exchange, rkey, Buffer.from(mensagem));

  setTimeout(() => {
    canal.close()
    conexao.close()

    res.send({sucesso: 'Pedido adicionado à fila'})
  }, 500)
})

app.listen(PORTA, () => {
  console.log(`Servidor inscrições ${PORTA}`)
})