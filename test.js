"use strict"

var assert = require("assert")
var jsonl = require("./")
var through = require("through2")

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

    stream.write('[{"hi":0},{"hi":1},{"hi":2},{"hi":3},{"hi":4}]')
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

  it("returns a stream in object mode", function (done) {
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

  it("converts object mode to buffers", function (done) {
    var data = []
    var stream = through.obj()

    stream
      .pipe(jsonl({toBufferStream: true}))
      .on("data", function (chunk) {
        data.push(chunk)
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

    stream.push({hi: 0})
    stream.push({hi: 1})
    stream.push({hi: 2})
    stream.push({hi: 3})
    stream.push({hi: 4})
    stream.end()
  })

  it("plucks [obj] properties from same depth", function (done) {
    var data = []
    var stream = through.obj()

    stream
      .pipe(jsonl({
        toBufferStream: true, depth: 3, pluck: ["one","two"]
      }))
      .on("data", function (chunk) {
        data.push(chunk)
      })
      .on("end", function () {
        assert.deepEqual(data, [
          new Buffer('{"one":{"yo":"hey"}}\n'),
          new Buffer('{"two":["h","e","y"]}\n'),
          new Buffer('{"one":{"yo":"hey"}}\n'),
          new Buffer('{"two":["h","e","y"]}\n'),
          new Buffer('{"one":{"yo":"hey"}}\n')
        ])
        done()
      })

    var obj =
    /*0*/{
    /*111*/hi: [
    /*22222*/{
    /*3333333*/one: {
    /*444444444*/yo: "hey"
    /*3333333*/}
    /*22222*/}
    /*111*/]
    /*0*/}
    var arr =
    /*0*/{
    /*111*/hi: [
    /*22222*/{
    /*3333333*/two: ["h","e","y"]
    /*22222*/}
    /*111*/]
    /*0*/}

    stream.push(obj)
    stream.push(arr)
    stream.push(obj)
    stream.push(arr)
    stream.push(obj)
    stream.end()
  })
})
