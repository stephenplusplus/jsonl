"use strict"

var assert = require("assert")
var jsonl = require("./")
var through = require("through2")

var stream = through()

describe("jsonl", function () {
  it("chunks out new lines", function (done) {
    var data = []
    var stream = through()

    stream
      .pipe(jsonl())
      .on("data", function (c) {
        data.push(c)
      })
      .on("end", function () {
        assert.deepEqual(data, [
          new Buffer('{"hi":0}\n'),
          new Buffer('{"hi":1}\n'),
          new Buffer('{"hi":2}\n'),
          new Buffer('{"hi":3}\n'),
          new Buffer('{"hi":4}\n')
        ])
        done()
      })

    stream.write('[{"hi":0},{"hi":1},{"hi":2},{"hi":3},{"hi":4}')
    stream.end()
  })

  it("allows overriding depth", function (done) {
    var data = []
    var stream = through()

    stream
      .pipe(jsonl({depth: 0}))
      .on("data", function (c) {
        data.push(c)
      })
      .on("end", function () {
        assert.deepEqual(data, [
          new Buffer('{"hi":0}\n'),
          new Buffer('{"hi":1}\n'),
          new Buffer('{"hi":2}\n'),
          new Buffer('{"hi":3}\n'),
          new Buffer('{"hi":4}\n')
        ])
        done()
      })

    stream.write('{"hi":0}')
    stream.write('{"hi":1}')
    stream.write('{"hi":2}')
    stream.write('{"hi":3}')
    stream.write('{"hi":4}')
    stream.end()
  })

  it("allows overriding separator", function (done) {
    var data = []
    var stream = through()

    stream
      .pipe(jsonl({separator: "&&"}))
      .on("data", function (c) {
        data.push(c)
      })
      .on("end", function () {
        assert.deepEqual(data, [
          new Buffer('{"hi":0}&&'),
          new Buffer('{"hi":1}&&'),
          new Buffer('{"hi":2}&&'),
          new Buffer('{"hi":3}&&'),
          new Buffer('{"hi":4}&&')
        ])
        done()
      })

    stream.write('[{"hi":0},{"hi":1},{"hi":2},{"hi":3},{"hi":4}')
    stream.end()
  })

  it("works in object mode", function (done) {
    var data = []
    var stream = through()

    stream
      .pipe(jsonl({objectMode: true}))
      .on("data", function (obj) {
        data.push(obj)
      })
      .on("end", function () {
        assert.deepEqual(data, [
          { hi: 0 },
          { hi: 1 },
          { hi: 2 },
          { hi: 3 },
          { hi: 4 }
        ])
        done()
      })

    stream.write('[{"hi":0},{"hi":1},{"hi":2},{"hi":3},{"hi":4}')
    stream.end()
  })
})
