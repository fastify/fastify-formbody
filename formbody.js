'use strict'

const Busboy = require('busboy')
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

  fastify.addContentTypeParser('multipart/form-data', (req, done) => {
    const body = {}
    const multipartOpts = Object.assign({ bufferOnly: true }, opts.multipart || {}, { headers: req.headers })
    const stream = new Busboy(multipartOpts)

    req.on('error', (err) => {
      stream.destroy()
      done(err)
    })

    stream.on('finish', () => done(null, body))

    stream.on('file', (field, file, filename, encoding, mimetype) => {
      file.on('data', (data) => {
        if (!body[field]) {
          body[field] = []
        }

        body[field].push(data)
      })

      file.on('end', () => {
        const buffer = Buffer.concat(body[field].map((part) => Buffer.isBuffer(part) ? part : Buffer.from(part)))
        body[field] = !multipartOpts.bufferOnly ? buffer : { buffer, filename }
      })
    })

    req.pipe(stream)
  })

  next()
}

module.exports = fp(formBodyPlugin, {
  fastify: '^2.0.0',
  name: 'fastify-formbody'
})
