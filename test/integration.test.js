'use strict'

const test = require('node:test')
const Fastify = require('fastify')
const plugin = require('../')
const qs = require('qs')
const formAutoContent = require('form-auto-content')

test('success route succeeds', async (t) => {
  const fastify = Fastify()

  await fastify.register(plugin)
  fastify.post('/test1', (req, res) => {
    res.send(Object.assign({}, req.body, { message: 'done' }))
  })

  await fastify.listen({ port: 0 })
  fastify.server.unref()

  const response = await fastify.inject({
    path: '/test1',
    method: 'POST',
    ...formAutoContent({ foo: 'foo' })
  })
  t.assert.ifError(response.error)
  t.assert.strictEqual(response.statusCode, 200)
  t.assert.deepStrictEqual(JSON.parse(response.body), { foo: 'foo', message: 'done' })
})

test('cannot exceed body limit', async (t) => {
  const fastify = Fastify()

  await fastify.register(plugin, { bodyLimit: 10 })
  fastify.post('/limited', (req, res) => {
    res.send(Object.assign({}, req.body, { message: 'done' }))
  })

  await fastify.listen({ port: 0 })
  fastify.server.unref()

  const payload = require('node:crypto').randomBytes(128).toString('hex')
  const response = await fastify.inject({
    path: '/limited',
    method: 'POST',
    ...formAutoContent({ foo: payload })
  })
  t.assert.ifError(response.error)
  t.assert.strictEqual(response.statusCode, 413)
  t.assert.strictEqual(JSON.parse(response.body).message, 'Request body is too large')
})

test('cannot exceed body limit when Content-Length is not available', async (t) => {
  const fastify = Fastify()

  fastify.addHook('onSend', (request, reply, payload, next) => {
    reply.send = function mockSend (arg) {
      t.assert.fail('reply.send() was called multiple times')
    }
    setTimeout(next, 1)
  })

  await fastify.register(plugin, { bodyLimit: 10 })
  fastify.post('/limited', (req, res) => {
    res.send(Object.assign({}, req.body, { message: 'done' }))
  })

  await fastify.listen({ port: 0 })
  fastify.server.unref()

  let sent = false
  const payload = require('node:stream').Readable({
    read: function () {
      this.push(sent ? null : Buffer.alloc(70000, 'a'))
      sent = true
    }
  })

  const response = await fastify.inject({
    path: '/limited',
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: payload
  })
  t.assert.ifError(response.error)
  t.assert.strictEqual(response.statusCode, 413)
  t.assert.strictEqual(JSON.parse(response.body).message, 'Request body is too large')
})

test('cannot exceed body limit set on Fastify instance', async (t) => {
  const fastify = Fastify({ bodyLimit: 10 })

  await fastify.register(plugin)
  fastify.post('/limited', (req, res) => {
    res.send(Object.assign({}, req.body, { message: 'done' }))
  })

  await fastify.listen({ port: 0 })
  fastify.server.unref()

  const payload = require('node:crypto').randomBytes(128).toString('hex')
  const response = await fastify.inject({
    path: '/limited',
    method: 'POST',
    ...formAutoContent({ foo: payload })
  })
  t.assert.ifError(response.error)
  t.assert.strictEqual(response.statusCode, 413)
  t.assert.strictEqual(JSON.parse(response.body).message, 'Request body is too large')
})

test('plugin bodyLimit should overwrite Fastify instance bodyLimit', async (t) => {
  const fastify = Fastify({ bodyLimit: 100000 })

  fastify.register(plugin, { bodyLimit: 10 })
  fastify.post('/limited', (req, res) => {
    res.send(Object.assign({}, req.body, { message: 'done' }))
  })

  await fastify.listen({ port: 0 })
  fastify.server.unref()

  const payload = require('node:crypto').randomBytes(128).toString('hex')
  const response = await fastify.inject({
    path: '/limited',
    method: 'POST',
    ...formAutoContent({ foo: payload })
  })
  t.assert.ifError(response.error)
  t.assert.strictEqual(response.statusCode, 413)
  t.assert.strictEqual(JSON.parse(response.body).message, 'Request body is too large')
})

test('plugin should throw if opts.parser is not a function', async (t) => {
  const fastify = Fastify()
  try {
    await fastify.register(plugin, { parser: 'invalid' })
    await fastify.listen({ port: 0 })
  } catch (err) {
    t.assert.ok(err)
    t.assert.match(err.message, /parser must be a function/)
  } finally {
    fastify.server.unref()
  }
})

test('plugin should not parse nested objects by default', async (t) => {
  const fastify = Fastify()

  fastify.register(plugin)
  fastify.post('/test1', (req, res) => {
    res.send(Object.assign({}, req.body, { message: 'done' }))
  })

  await fastify.listen({ port: 0 })
  fastify.server.unref()

  const response = await fastify.inject({
    path: '/test1',
    method: 'POST',
    ...formAutoContent({ 'foo[one]': 'foo', 'foo[two]': 'bar' })
  })
  t.assert.ifError(response.error)
  t.assert.strictEqual(response.statusCode, 200)
  t.assert.deepStrictEqual(JSON.parse(response.body), { 'foo[one]': 'foo', 'foo[two]': 'bar', message: 'done' })
})

test('plugin should allow providing custom parser as option', async (t) => {
  const fastify = Fastify()

  // this makes sure existing users for <= 4 have upgrade path
  fastify.register(plugin, { parser: str => qs.parse(str) })
  fastify.post('/test1', (req, res) => {
    res.send(Object.assign({}, req.body, { message: 'done' }))
  })

  await fastify.listen({ port: 0 })
  fastify.server.unref()

  const response = await fastify.inject({
    path: '/test1',
    method: 'POST',
    ...formAutoContent({ 'foo[one]': 'foo', 'foo[two]': 'bar' })
  })
  t.assert.ifError(response.error)
  t.assert.strictEqual(response.statusCode, 200)
  t.assert.deepStrictEqual(JSON.parse(response.body), { foo: { one: 'foo', two: 'bar' }, message: 'done' })
})
