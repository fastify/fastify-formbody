'use strict'

const fp = require('fastify-plugin')
const qs = require('qs')

function formBodyPlugin (fastify, options, next) {
  const opts = Object.assign({}, options || {})

  function contentParser (req, body, done) {
    done(null, qs.parse(body.toString()))
  }

  fastify.addContentTypeParser(
    'application/x-www-form-urlencoded',
    { parseAs: 'buffer', bodyLimit: opts.bodyLimit },
    contentParser
  )
  next()
}

module.exports = fp(formBodyPlugin, {
  fastify: '^2.0.0',
  name: 'fastify-formbody'
})
