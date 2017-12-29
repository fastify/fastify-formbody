'use strict'

const tap = require('tap')
const test = tap.test
const fastify = require('fastify')()
const request = require('request')
const plugin = require('../')

test('successful route', (t) => {
  t.plan(1)
  try {
    fastify.post('/test1', (req, res) => {
      res.send(Object.assign({}, req.body, {message: 'done'}))
    })
    t.pass()
  } catch (e) {
    t.fail(e.message)
  }
})

fastify.register(plugin, (err) => { if (err) tap.error(err) })

fastify.listen(0, (err) => {
  if (err) tap.error(err)
  fastify.server.unref()

  const reqOpts = {
    method: 'POST',
    baseUrl: 'http://localhost:' + fastify.server.address().port
  }
  const req = request.defaults(reqOpts)

  test('success route succeeds', (t) => {
    t.plan(3)
    req({uri: '/test1', form: {foo: 'foo'}}, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.deepEqual(JSON.parse(body), {foo: 'foo', message: 'done'})
    })
  })
})
