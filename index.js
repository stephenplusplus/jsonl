"use strict"

var jsonparse = require("jsonparse")
var through = require("through2")

module.exports = function (opts) {
  opts = opts || {}

  var parser = new jsonparse()

  var jsonl = through(opts, function (chunk, enc, next) {
    parser.write(chunk)
    next()
  })

  parser.onValue = function (value) {
    if (this.stack.length === (typeof opts.depth === "number" ? opts.depth : 1)) {
      if (opts.objectMode) jsonl.push(value)
      else jsonl.push(JSON.stringify(value) + (opts.separator || "\n"))
    }
  }

  return jsonl
}
