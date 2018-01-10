'use strict'

const tap = require('tap')
const test = tap.test
const Fastify = require('fastify')
const request = require('request')
const plugin = require('../')

test('succes route succeeds', (t) => {
  t.plan(3)
  const fastify = Fastify()

  fastify
    .register(plugin)
    .post('/test1', (req, res) => {
      res.send(Object.assign({}, req.body, {message: 'done'}))
    })

  fastify.listen(0, (err) => {
    if (err) tap.error(err)
    fastify.server.unref()

    const reqOpts = {
      method: 'POST',
      baseUrl: 'http://localhost:' + fastify.server.address().port
    }
    const req = request.defaults(reqOpts)
    req({uri: '/test1', form: {foo: 'foo'}}, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.deepEqual(JSON.parse(body), {foo: 'foo', message: 'done'})
    })
  })
})

test('cannot exceed body limit', (t) => {
  t.plan(3)
  const fastify = Fastify()

  fastify
    .register(plugin, {bodyLimit: 10})
    .post('/limited', (req, res) => {
      res.send(Object.assign({}, req.body, {message: 'done'}))
    })

  fastify.listen(0, (err) => {
    if (err) tap.error(err)
    fastify.server.unref()

    const reqOpts = {
      method: 'POST',
      baseUrl: 'http://localhost:' + fastify.server.address().port
    }
    const req = request.defaults(reqOpts)
    const payload = require('crypto').randomBytes(128).toString('hex')
    req({uri: '/limited', form: {foo: payload}}, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 500)
      t.is(JSON.parse(body).message, 'Form data exceeds allowed limit: 10')
    })
  })
})
