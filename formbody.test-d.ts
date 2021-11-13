import fastify from 'fastify'
import querystring from 'querystring'
import formBodyPlugin, { FormBodyPluginOptions } from './formbody'

const app = fastify()
app.register(formBodyPlugin)

const emptyOpts: FormBodyPluginOptions = {}
app.register(formBodyPlugin, emptyOpts)

const bodyLimitOpts: FormBodyPluginOptions = {
  bodyLimit: 1000
}
app.register(formBodyPlugin, bodyLimitOpts)

const parserOpts: FormBodyPluginOptions = {
  parser: (s) => querystring.parse(s)
}
app.register(formBodyPlugin, parserOpts)
