import fastify from 'fastify'
import formBodyPlugin, { FormBodyPluginOptions } from './formbody'

const app = fastify()
app.register(formBodyPlugin)

const emptyOpts: FormBodyPluginOptions = {}
app.register(formBodyPlugin, emptyOpts)

const opts: FormBodyPluginOptions = {
  bodyLimit: 1000
}
app.register(formBodyPlugin, opts)
