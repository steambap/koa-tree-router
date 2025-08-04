const { test, describe } = require("node:test");
const assert = require("node:assert");
const Router = require("../router");
const RouteGroup = require("../routegroup");

const noOp = function () {};

describe("Route Group", () => {
  test("works!", () => {
    const r = new Router();
    const group = new RouteGroup(r, "/foo");
    group.get("/bar", noOp);
    assert(r.find("GET", "/foo/bar").handle);
  });

  test("works in router", () => {
    const r = new Router();
    const group = r.newGroup("/bar");
    group.post("/", noOp);
    group.get("/foo", noOp);
    assert(r.find("POST", "/bar").handle);
    assert(r.find("GET", "/bar/foo").handle);
  });

  test("uses middleware from `use` in `on`", () => {
    const r = new Router();
    const group = new RouteGroup(r, "/foo");
    group.use(noOp);
    group.get("/bar", noOp);
    assert(r.find("GET", "/foo/bar").handle);
    assert.strictEqual(r.find("GET", "/foo/bar").handle.length, 2);
  });

  test("works with multiple handle", () => {
    const r = new Router();
    const group = new RouteGroup(r, "/foo");
    group.get("/bar", noOp, noOp, noOp);
    assert.strictEqual(r.find("GET", "/foo/bar").handle.length, 3);
  });
});
