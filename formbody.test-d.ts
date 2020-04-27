import fastify from 'fastify'
import formBodyPlugin from './formbody'

const app = fastify()
app.register(formBodyPlugin)
app.register(formBodyPlugin, {})
app.register(formBodyPlugin, {
  bodyLimit: 1000
})
