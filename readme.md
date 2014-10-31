# jso\nl

> Transform a stream of JSON into a stream of [Line Delimited JSON](http://en.wikipedia.org/wiki/Line_Delimited_JSON)

## Install
```sh
$ npm install --save jsonl
```

## Use
```js
var jsonl = require("jsonl")
var request = require("request")
var zlib = require("zlib")

var jeopardyQuestions = "http://skeeto.s3.amazonaws.com/share/JEOPARDY_QUESTIONS1.json.gz"

request.get(jeopardyQuestions)
  .pipe(zlib.Gunzip())
  .pipe(jsonl())
  .pipe(process.stdout)
```

![](jeopardy.gif)

## API

### var jsonl = require("jsonl")([opts])

#### opts.depth
- Type: `Number` (default: `1`)

The depth of the objects in the incoming data to pluck out. This is what you want for an array of objects, such as:

```json
[{"this":"that"},{"this":"that"}]
```

#### opts.objectMode
- Type: `Boolean` (default: `false`)

Convert data into an object stream.

#### opts.pluck
- Type: `Array|String` (default: [])

Only return select properties from JSON objects.

#### opts.separator
- Type: `String` (default: `\n`)

String to separate object data with.

#### opts.toBufferStream
- Type: `Boolean` (default: `false`)

Set this to true when you have an object stream that you would like converted to a stream of line delimited JSON buffers.

If set, this defaults `opts.depth` to `0`, but can still be overridden.

## License

MIT © [Stephen Sawchuk](http://stephenplusplus.com)