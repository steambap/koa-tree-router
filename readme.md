# Koa tree router

Koa tree router a high performance router for Koa.

## Features

- Fast. Up to 12 times faster than Koa-router. 

- Express routing using `router.get`, `router.put`, `router.post`, etc.

- Multiple middlewares per route

## How does it work?

The router relies on a tree structure which makes heavy use of *common prefixes*, it is basically a *compact* [*prefix tree*](https://en.wikipedia.org/wiki/Trie) (or just [*Radix tree*](https://en.wikipedia.org/wiki/Radix_tree)).

This module's tree implementation is based on [julienschmidt/httprouter](https://github.com/julienschmidt/httprouter).

