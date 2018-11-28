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
      res.send(Object.assign({}, req.body, { message: 'done' }))
    })

  fastify.listen(0, (err) => {
    if (err) tap.error(err)
    fastify.server.unref()

    const reqOpts = {
      method: 'POST',
      baseUrl: 'http://localhost:' + fastify.server.address().port
    }
    const req = request.defaults(reqOpts)
    req({ uri: '/test1', form: { foo: 'foo' } }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.deepEqual(JSON.parse(body), { foo: 'foo', message: 'done' })
    })
  })
})

test('cannot exceed body limit', (t) => {
  t.plan(3)
  const fastify = Fastify()

  fastify
    .register(plugin, { bodyLimit: 10 })
    .post('/limited', (req, res) => {
      res.send(Object.assign({}, req.body, { message: 'done' }))
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
    req({ uri: '/limited', form: { foo: payload } }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 413)
      t.is(JSON.parse(body).message, 'FST_ERR_CTP_BODY_TOO_LARGE: Request body is too large')
    })
  })
})

test('cannot exceed body limit when Content-Length is not available', (t) => {
  t.plan(3)
  const fastify = Fastify()

  fastify.addHook('onSend', (request, reply, payload, next) => {
    reply.send = function mockSend (arg) {
      t.fail('reply.send() was called multiple times')
    }
    setTimeout(next, 1)
  })

  fastify
    .register(plugin, { bodyLimit: 10 })
    .post('/limited', (req, res) => {
      res.send(Object.assign({}, req.body, { message: 'done' }))
    })

  fastify.listen(0, (err) => {
    if (err) tap.error(err)
    fastify.server.unref()

    const reqOpts = {
      method: 'POST',
      baseUrl: 'http://localhost:' + fastify.server.address().port,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
    const req = request.defaults(reqOpts)
    var sent = false
    const payload = require('stream').Readable({
      read: function () {
        this.push(sent ? null : Buffer.alloc(70000, 'a'))
        sent = true
      }
    })
    req({ uri: '/limited', body: payload }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 413)
      t.is(JSON.parse(body).message, 'FST_ERR_CTP_BODY_TOO_LARGE: Request body is too large')
    })
  })
})

test('cannot exceed body limit set on Fastify instance', (t) => {
  t.plan(3)
  const fastify = Fastify({ bodyLimit: 10 })

  fastify
    .register(plugin)
    .post('/limited', (req, res) => {
      res.send(Object.assign({}, req.body, { message: 'done' }))
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
    req({ uri: '/limited', form: { foo: payload } }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 413)
      t.is(JSON.parse(body).message, 'FST_ERR_CTP_BODY_TOO_LARGE: Request body is too large')
    })
  })
})

test('plugin bodyLimit should overwrite Fastify instance bodyLimit', (t) => {
  t.plan(3)
  const fastify = Fastify({ bodyLimit: 100000 })

  fastify
    .register(plugin, { bodyLimit: 10 })
    .post('/limited', (req, res) => {
      res.send(Object.assign({}, req.body, { message: 'done' }))
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
    req({ uri: '/limited', form: { foo: payload } }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 413)
      t.is(JSON.parse(body).message, 'FST_ERR_CTP_BODY_TOO_LARGE: Request body is too large')
    })
  })
})
