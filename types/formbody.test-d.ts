import fastify from 'fastify'
import querystring from 'querystring'
import { expectDeprecated, expectError, expectType } from 'tsd'
import formBodyPlugin, { FastifyFormbodyOptions, FormBodyPluginOptions } from '..'

const app = fastify()
app.register(formBodyPlugin)

app.register(formBodyPlugin, { })
app.register(formBodyPlugin, {
  bodyLimit: 1000
})
app.register(formBodyPlugin, {
  parser: (s) => querystring.parse(s)
})

expectType<FormBodyPluginOptions>({} as FastifyFormbodyOptions)
expectDeprecated({} as FormBodyPluginOptions)

expectError(app.register(formBodyPlugin, { invalid: true }))
