'use strict'

const fastify = require('fastify')()

fastify.addHook('onSend', (request, reply, payload, next) => {
  setTimeout(next, 1)
})

fastify
  .register(require('../'), {bodyLimit: 500})
  .post('/', function (req, reply) {
    reply.send({success: true})
  })

fastify.listen(0, (err) => {
  if (err) {
    process.send({error: err})
    process.exit(1)
  }

  process.send({port: fastify.server.address().port})
  process.on('message', (m) => {
    if (m === 'stop') fastify.close()
  })
})
