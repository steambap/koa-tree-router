const { test, describe } = require("node:test");
const assert = require("node:assert");
const Router = require("../router");

const noOp = function() {};

describe("Router", () => {
  test("works!", () => {
    assert(new Router() instanceof Router);
  });

  test("throws with invalid input", () => {
    const router = new Router();
    assert.throws(() => router.on("GET", "invalid", noOp));
  });

  test("support `get`", () => {
    const router = new Router();
    router.get("/", noOp);
    assert(router.find("GET", "/").handle);
  });

  test("support `post`", () => {
    const router = new Router();
    router.post("/", noOp);
    assert(router.find("POST", "/").handle);
  });

  test("support `put`", () => {
    const router = new Router();
    router.put("/", noOp);
    assert(router.find("PUT", "/").handle);
  });

  test("support `delete`", () => {
    const router = new Router();
    router.delete("/", noOp);
    assert(router.find("DELETE", "/").handle);
  });

  test("support `head`", () => {
    const router = new Router();
    router.head("/", noOp);
    assert(router.find("HEAD", "/").handle);
  });

  test("support `patch`", () => {
    const router = new Router();
    router.patch("/", noOp);
    assert(router.find("PATCH", "/").handle);
  });

  test("support `options`", () => {
    const router = new Router();
    router.options("/", noOp);
    assert(router.find("OPTIONS", "/").handle);
  });

  test("support `trace`", () => {
    const router = new Router();
    router.trace("/", noOp);
    assert(router.find("TRACE", "/").handle);
  });

  test("support `connect`", () => {
    const router = new Router();
    router.connect("/", noOp);
    assert(router.find("CONNECT", "/").handle);
  });

  test("support wildcard `all`", () => {
    const router = new Router();
    router.all("/", noOp);
    assert(router.find("DELETE", "/").handle);
    assert(router.find("GET", "/").handle);
    assert(router.find("HEAD", "/").handle);
    assert(router.find("PATCH", "/").handle);
    assert(router.find("POST", "/").handle);
    assert(router.find("PUT", "/").handle);
    assert(router.find("OPTIONS", "/").handle);
    assert(router.find("TRACE", "/").handle);
    assert(router.find("CONNECT", "/").handle);
  });

  test("uses middleware from `use` in `on`", () => {
    const router = new Router();
    router.use(noOp);
    router.on("GET", "/", noOp);
    assert(router.find("GET", "/").handle);
    assert.strictEqual(router.find("GET", "/").handle.length, 2);
  });

  test("works with multiple handle", () => {
    const router = new Router();
    router.get("/", noOp, noOp, noOp);
    assert.strictEqual(router.find("GET", "/").handle.length, 3);
  });
});
