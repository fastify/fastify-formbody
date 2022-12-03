'use strict'

const fp = require('fastify-plugin')
const { parse } = require('fast-querystring')

function defaultParser (str) {
  return parse(str)
}

function fastifyFormbody (fastify, options, next) {
  const opts = Object.assign({ parser: defaultParser }, options)
  if (typeof opts.parser !== 'function') {
    next(new Error('parser must be a function'))
    return
  }

  function contentParser (req, body, done) {
    done(null, opts.parser(body.toString()))
  }

  fastify.addContentTypeParser(
    'application/x-www-form-urlencoded',
    { parseAs: 'buffer', bodyLimit: opts.bodyLimit },
    contentParser
  )
  next()
}

module.exports = fp(fastifyFormbody, {
  fastify: '4.x',
  name: '@fastify/formbody'
})
module.exports.default = fastifyFormbody
module.exports.fastifyFormbody = fastifyFormbody
