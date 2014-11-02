"use strict"

var jsonparse = require("jsonparse")
var through = require("through2")

module.exports = function (opts) {
  opts = opts || {}

  var parser = new jsonparse()
  var json = {}

  if (opts.toBufferStream) opts.objectMode = true
  if (opts.pluck) opts.pluck = Array.isArray(opts.pluck) ? opts.pluck : [opts.pluck]

  opts.depth = typeof opts.depth === "number"? opts.depth : opts.toBufferStream ? 0 : 1

  var jsonl = through(opts, function (chunk, enc, next) {
    parser.write(Buffer.isBuffer(chunk) ? chunk : JSON.stringify(chunk))
    next()
  })

  parser.onValue = function (value) {
    var skip = true

    if (this.stack.length === opts.depth) {
      if (!opts.pluck)
        skip = false
      else if (this.key && opts.pluck.indexOf(this.key.toString().toLowerCase()) > -1)
        json[this.key] = value
    }

    if (this.stack.length <= opts.depth && Object.keys(json).length > 0) {
      skip = false
      value = json
      json = {}
    }

    if (skip) return

    if (opts.objectMode && !opts.toBufferStream)
      jsonl.push(value)
    else if (opts.toBufferStream)
      jsonl.push(new Buffer(JSON.stringify(value) + (opts.separator || "\n")))
    else
      jsonl.push(JSON.stringify(value) + (opts.separator || "\n"))
  }

  return jsonl
}
