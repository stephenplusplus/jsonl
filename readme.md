# jso\nl

> Transform a stream of JSON into a stream of [Line Delimited JSON](http://en.wikipedia.org/wiki/Line_Delimited_JSON)

## Install
```sh
$ npm install --save jsonl
```

## Use

### From Buffers
```js
var fs = require("fs")
var jsonl = require("jsonl")

fs.createReadStream("./in.json")
  .pipe(jsonl())
  .pipe(fs.createWriteStream("./out.json"))
```
#### `in.json`
```json
[{"test":"value"},{"test":"value"},{"test":"value"},{"test":"value"}]
```
#### `out.json`
```json
{"test":"value"}
{"test":"value"}
{"test":"value"}
{"test":"value"}

```

### From Objects
```js
var fs = require("fs")
var jsonl = require("jsonl")
var through = require("through2")
var stream = through.obj()

stream.pipe(jsonl({toBufferStream:true}))
  .pipe(fs.createWriteStream("./out.json"))

stream.push({test:"value"})
stream.push({test:"value"})
stream.push({test:"value"})
stream.push({test:"value"})
stream.end()
```
#### `out.json`
```json
{"test":"value"}
{"test":"value"}
{"test":"value"}
{"test":"value"}

```

### Depth
To get the results you expect, you will likely need to know the structure of your incoming data. You may have to pass a `depth` property, which corresponds to the layer of the property in a serialized, nested JSON object.

By default, jsonl will use a depth of 1 when reading data from a Buffer stream (expecting objects to be nested in an array), and a depth of 0 from a stream in object mode.

```js
/*0*/[
/*1*/  {
/*2*/    test: "value"
/*1*/  },
/*1*/  {
/*2*/    test: "value"
/*1*/  }
/*0*/]
```

### Plucking
To filter the incoming data based on properties, you can select specific fields to be plucked out of the incoming object.

\* You will need to specify a `depth` property for the nested level of the property.


```js
var fs = require("fs")
var jsonl = require("jsonl")

fs.createReadStream("./in.json")
  .pipe(jsonl({pluck:["category"], depth:2}))
  .pipe(fs.createWriteStream("./out.json"))
```
#### `in.json`
```json
[{"category": "cactus heights", "question":"?", "answer": "!"},{"category": "giraffe shoe sizes", "question":"?", "answer": "!"}]
```
#### `out.json`
```json
{"category":"cactus heights"}
{"category":"giraffe shoe sizes"}

```

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
