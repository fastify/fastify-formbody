# @fastify/formbody

![CI](https://github.com/fastify/fastify-formbody/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@fastify/formbody.svg?style=flat)](https://www.npmjs.com/package/@fastify/formbody)
[![NPM downloads](https://img.shields.io/npm/dm/fastify-formbody.svg?style=flat)](https://www.npmjs.com/package/@fastify/formbody)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A simple plugin for [Fastify][fastify] that adds a content type parser for
the content type `application/x-www-form-urlencoded`.

[fastify]: https://fastify.dev/

This branch targets Fastify v4. Please refer to [this branch](https://github.com/fastify/fastify-formbody/tree/3.x) and related versions for Fastify `^2.0.0` compatibility.

For Fastify v3 support, please use @fastify/formbody `^6.0.1`.

## Install

```
npm i @fastify/formbody
```

## Example

Given the following code:

```js
const fastify = require('fastify')()

fastify.register(require('@fastify/formbody'))

fastify.post('/', (req, reply) => {
  reply.send(req.body)
})

fastify.listen({ port: 8000 }, (err) => {
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

+ `bodyLimit`: The maximum amount of bytes to process
before returning an error. If the limit is exceeded, a `500` error will be
returned immediately. When set to `undefined` the limit will be set to whatever
is configured on the parent Fastify instance. The default value is
whatever is configured in
[fastify](https://github.com/fastify/fastify/blob/main/docs/Reference/Server.md#bodylimit)
 (`1048576` by default).
+ `parser`: The default parser used is the querystring.parse built-in.  You can change this default by passing a parser function e.g. `fastify.register(require('@fastify/formbody'), { parser: str => myParser(str) })`

## Upgrading from 4.x

Previously, the external [qs lib](https://github.com/ljharb/qs) was used that did things like parse nested objects. For example:

- ***Input:*** `foo[one]=foo&foo[two]=bar`
- ***Parsed:*** `{ foo: { one: 'foo', two: 'bar' } }`

The way this is handled now using the built-in querystring.parse:

- ***Input:*** `foo[one]=foo&foo[two]=bar`
- ***Parsed:*** `{ 'foo[one]': 'foo', 'foo[two]': 'bar' }`

If you need nested parsing, you must configure it manually by installing the qs lib (`npm i qs`), and then configure an optional parser:

```js
const fastify = require('fastify')()
const qs = require('qs')
fastify.register(require('@fastify/formbody'), { parser: str => qs.parse(str) })
```

## License

Licensed under [MIT](./LICENSE)
