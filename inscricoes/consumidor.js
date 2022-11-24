const knex = require('knex')
const config = require('./knexfile')
const db = knex(config.development)
const axios = require('axios')
const amqplib = require('amqplib')

const URL_CURSO = 'http://localhost:7777'
const URL_ESUTDANTE = 'http://localhost:9999'
const URL_AMQP = 'amqps://pazvandg:mAeMqEt-s2R7bm2YCxiXAh2AIqJchX1v@jackal.rmq.cloudamqp.com/pazvandg'


const consumir = async () => {
  const conexao = await amqplib.connect(URL_AMQP)
  const canal = await conexao.createChannel()
  const FILA = 'fila_inscricao' 

  await canal.assertQueue(FILA)
  await canal.consume(FILA, (mensagem) => {
    if (mensagem == null) {
      console.log('Conexão encerrada pelo servidor')
      return
    }
    canal.ack(mensagem)
    const dados = JSON.parse(mensagem.content.toString())
    inscrever(dados)
  })
}

const inscrever = async (dados) => {
  const cursoResposta = await axios.get(URL_CURSO +'/v1/cursos/'+ dados.curso_id)
  if (cursoResposta.status == 404) {
    return console.log('Curso não encontrado')
  }
  if (cursoResposta.status != 200) {
    return console.log('Ocorreu um erro no serviço de curso')
  }

  const estudanteResposta = await axios
    .get(URL_ESUTDANTE +'/v1/estudantes/'+ dados.estudante_id)
  if (estudanteResposta.status == 404) {
    return console.log('Estudante não encontrado')
  }
  if (estudanteResposta.status != 200) {
    return console.log('Ocorreu um erro no serviço de estudante')
  }
  dados.estudante_nome = estudanteResposta.data.nome
  dados.status = 'CONFIRMADO'

  const total = await db('inscricoes')
    .where('curso_id', dados.curso_id)
    .count('id as quantidade')
    .first()

  if (total.quantidade >= cursoResposta.data.quantidadeVagas) {
    return console.log({erro: 'Não há mais vagas no curso'})
  }

  db('inscricoes')
    .where('curso_id', dados.curso_id)
    .andWhere('estudante_id', dados.estudante_id)
    .first()
    .then((estudante) => {
      if (estudante) {
        return console.log('Estudante já inscrito')
      }
      db('inscricoes')
        .insert(dados)
        .returning('*')
        .then(([inscricao]) => {
          console.log('Estudante inscrito com sucesso')
        })
    })
}
consumir()