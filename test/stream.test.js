'use strict'

const fork = require('child_process').fork
const http = require('http')
const path = require('path')
const test = require('tap').test

test('connection ends when limit reached', (t) => {
  t.plan(3)
  const proc = fork(path.join(__dirname, 'server.js'))

  t.tearDown(() => proc.send('stop'))

  proc.on('message', (msg) => {
    if (msg.error) t.threw(msg.error)
    if (!msg.port) t.fail('port was not returned')
    const port = msg.port

    const req = http.request({
      host: '127.0.0.1',
      port: port,
      path: '/',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }, (res) => {
      t.is(res.statusCode, 500)
      res.on('data', (d) => {
        const err = JSON.parse(d)
        t.ok(err.message)
        t.is(err.message, 'Form data exceeds allowed limit: 500')
        proc.kill()
      })
    }).on('error', (err) => {
      t.fail('received request error', err)
      proc.send('stop')
    })

    const buff = Buffer.alloc(100000, 'a')
    for (var i = 0; i < 10000; i += 1) {
      req.write(buff)
    }

    req.end()
  })
})
