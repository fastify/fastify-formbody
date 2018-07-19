# fastify-formbody

[![Greenkeeper badge](https://badges.greenkeeper.io/fastify/fastify-formbody.svg)](https://greenkeeper.io/)

A simple plugin for [Fastify][fastify] that adds a content type parser for
the content type `application/x-www-form-urlencoded`.

[fastify]: https://www.fastify.io/

## Example

Given the following code:

```js
const fastify = require('fastify')()

fastify.register(require('fastify-formbody'))

fastify.post('/', (req, reply) => {
  reply.send(req.body)
})

fastify.listen(8000, (err) => {
  if (err) throw err
})
```

And a `POST` body of:

```html
foo=foo&bar=bar&answer=42
```

The sent reply would be the object:

```js
{
  foo: 'foo',
  bar: 'bar',
  answer: 42
}
```

## Options

The plugin accepts an options object with the following properties:

+ `bodyLimit`: the maximum amount of bytes to process
before returning an error. If the limit is exceeded, a `500` error will be
returned immediately. When set to `undefined` the limit will be set to whatever
is configured on the parent Fastify instance. The default value is
whatever is configured in
[fastify](https://github.com/fastify/fastify/blob/master/docs/Factory.md#bodylimit)
 (`1048576` by default).

## License

[MIT License](http://jsumners.mit-license.org/)
