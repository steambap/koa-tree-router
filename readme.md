# Koa tree router

[![Build Status](https://travis-ci.org/steambap/koa-tree-router.svg?branch=master)](https://travis-ci.org/steambap/koa-tree-router)
[![npm](https://img.shields.io/npm/v/koa-tree-router.svg)](https://npm.im/koa-tree-router)
![npm downloads](https://img.shields.io/npm/dt/koa-tree-router.svg)

Koa tree router is a high performance router for Koa.

## Features

- Fast. Up to 11 times faster than Koa-router. [Benchmark](https://github.com/delvedor/router-benchmark)

- Express-style routing using `router.get`, `router.put`, `router.post`, etc.

- Support for `405 method not allowed`

- Multiple middleware per route

## How does it work?

The router relies on a tree structure which makes heavy use of *common prefixes*, it is basically a *compact* [*prefix tree*](https://en.wikipedia.org/wiki/Trie) (or just [*Radix tree*](https://en.wikipedia.org/wiki/Radix_tree)).

This module's tree implementation is based on [julienschmidt/httprouter](https://github.com/julienschmidt/httprouter).

## Installation

```sh
# npm
npm i koa-tree-router
# yarn
yarn add koa-tree-router
```

## Usage

```JS
const Koa = require("koa");
const Router = require("koa-tree-router");

const app = new Koa();
const router = new Router();
router.get("/", function(ctx) {
  ctx.body = "hello, world";
});

app.use(router.routes());

app.listen(8080);
```

## API

#### Router([options])
Instance a new router.  
You can pass a middleware with the option `onMethodNotAllowed`.
```js
const router = require('koa-tree-router')({
  onMethodNotAllowed(ctx){
    ctx.body = "not allowed"
  }
})
```

#### on(method, path, middleware)
Register a new route.
```js
router.on('GET', '/example', (ctx) => {
  // your code
})
```

#### Shorthand methods
If you want to get expressive, here is what you can do:
```js
router.get(path, middleware)
router.delete(path, middleware)
router.head(path, middleware)
router.patch(path, middleware)
router.post(path, middleware)
router.put(path, middleware)
router.options(path, middleware)
router.trace(path, middleware)
router.connect(path, middleware)
```

If you need a route that supports *all* methods you can use the `all` api.
```js
router.all(path, middleware)
```

#### routes
Returns router middleware.

```JS
app.use(router.routes());
```

#### mount
Returns a koa middleware. Use this to mount multiple router or prefix your router.
```JS
app.use(router1.mount("/user"));
app.use(router2.mount("/comment"));
```

This module works nicely with [koa-mount](https://github.com/koajs/mount), and the above code is the same as:

```JS
const mount = require('koa-mount');
// ... other codes
app.use(mount("/user", router1.routes()));
app.use(mount("/comment", router2.routes()));
```

#### ctx.params
This object contains key-value pairs of named route parameters.

```JS
router.get("/user/:name", function() {
  // your code
});
// GET /user/1
ctx.params.name
// => "1"
```

## How to write routes
There are 3 types of routes:

1.Static
```
Pattern: /static

 /static                   match
 /anything-else            no match
```

2.Named

Named parameters have the form `:name` and only match a single path segment:
```
Pattern: /user/:user

 /user/gordon              match
 /user/you                 match
 /user/gordon/profile      no match
 /user/                    no match
```

3.Catch-all

Catch-all parameters have the form `*name` and match everything. They must always be at the **end** of the pattern:

```
Pattern: /src/*filepath

 /src/                     match
 /src/somefile.go          match
 /src/subdir/somefile.go   match
```

## License

[MIT](LICENSE)
