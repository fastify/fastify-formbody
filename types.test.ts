import fastify = require('fastify')
import formBodyPlugin = require('./formbody')

const app = fastify()
app.register(formBodyPlugin)
app.register(formBodyPlugin, {})
app.register(formBodyPlugin, {
  bodyLimit: 1000
})