'use strict'

const fp = require('fastify-plugin')
const qs = require('qs')

const internals = {}
internals.contentParser = function (req, done) {
  let body = ''
  req.on('error', done)
  req.on('data', (data) => { body = body + data })
  req.on('end', () => { return done(qs.parse(body)) })
}

function formBodyPlugin (fastify, options, next) {
  fastify.addContentTypeParser('application/x-www-form-urlencoded', internals.contentParser)
  next()
}

module.exports = fp(formBodyPlugin, '>=0.15.0')
module.exports.internals = internals
