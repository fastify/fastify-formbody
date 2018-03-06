'use strict'

const fp = require('fastify-plugin')
const qs = require('qs')

const DEFAULT_BODY_LIMIT = 1024 * 1024 // 1 MiB
const defaults = {
  bodyLimit: DEFAULT_BODY_LIMIT
}

function formBodyPlugin (fastify, options, next) {
  const opts = Object.assign({}, defaults, options || {})

  function contentParser (req, body, done) {
    done(null, qs.parse(body.toString()))
  }

  fastify.addContentTypeParser(
    'application/x-www-form-urlencoded',
    {parseAs: 'buffer', bodyLimit: opts.bodyLimit},
    contentParser
  )
  next()
}

module.exports = fp(formBodyPlugin, {
  fstify: '^1.0.0',
  name: 'fastify-formbody'
})
