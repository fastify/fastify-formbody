'use strict'

const fp = require('fastify-plugin')
const qs = require('qs')

const DEFAULT_BODY_LIMIT = 1024 * 1024 // 1 MiB
const defaults = {
  bodyLimit: DEFAULT_BODY_LIMIT
}

function formBodyPlugin (fastify, options, next) {
  const opts = Object.assign({}, defaults, options || {})

  function contentParser (req, done) {
    const bodyLimit = opts.bodyLimit
    const tooLargeError = Error('Form data exceeds allowed limit: ' + bodyLimit)
    tooLargeError.statusCode = 413
    const contentLength = (req.headers['content-length'])
      ? Number.parseInt(req.headers['content-length'], 10)
      : null
    if (contentLength > bodyLimit) return done(tooLargeError)

    let body = ''
    req.on('error', errorListener)
    req.on('data', dataListener)
    req.on('end', endListener)

    function errorListener (err) {
      done(err)
    }

    function dataListener (data) {
      body = body + data
      if (body.length > bodyLimit) {
        req.removeListener('error', errorListener)
        req.removeListener('data', dataListener)
        req.removeListener('end', endListener)
        done(tooLargeError)
      }
    }

    function endListener () {
      done(null, qs.parse(body))
    }
  }

  fastify.addContentTypeParser('application/x-www-form-urlencoded', contentParser)
  next()
}

module.exports = fp(formBodyPlugin, {
  fastify: '>=1.0.0-rc.1',
  name: 'fastify-formbody'
})
