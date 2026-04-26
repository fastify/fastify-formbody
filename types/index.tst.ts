import fastify from 'fastify'
import querystring from 'node:querystring'
import { expect } from 'tstyche'
import formBodyPlugin, {
  FastifyFormbodyOptions,
} from '..'

const app = fastify()
app.register(formBodyPlugin)

app.register(formBodyPlugin, {})
app.register(formBodyPlugin, {
  bodyLimit: 1000
})
app.register(formBodyPlugin, {
  parser: (s) => querystring.parse(s)
})

expect<FastifyFormbodyOptions>().type.toBeAssignableFrom({})

expect(app.register).type.not.toBeCallableWith(formBodyPlugin, {
  invalid: true
})
