const expect = require("expect");
const Router = require("../router");

const noOp = [function() {}];

describe("Router", () => {
  it("works!", () => {
    expect(new Router()).toBeInstanceOf(Router);
  });

  it("throws with invalid input", () => {
    const router = new Router();
    expect(() => router.on("GET", "invalid", noOp)).toThrow();
  });

  it("support `get`", () => {
    const router = new Router();
    router.get("/", noOp);
    expect(router.find("GET", "/").handle).toBeTruthy();
  });

  it("support `post`", () => {
    const router = new Router();
    router.post("/", noOp);
    expect(router.find("POST", "/").handle).toBeTruthy();
  });

  it("support `put`", () => {
    const router = new Router();
    router.put("/", noOp);
    expect(router.find("PUT", "/").handle).toBeTruthy();
  });

  it("support `delete`", () => {
    const router = new Router();
    router.delete("/", noOp);
    expect(router.find("DELETE", "/").handle).toBeTruthy();
  });

  it("support `head`", () => {
    const router = new Router();
    router.head("/", noOp);
    expect(router.find("HEAD", "/").handle).toBeTruthy();
  });

  it("support `patch`", () => {
    const router = new Router();
    router.patch("/", noOp);
    expect(router.find("PATCH", "/").handle).toBeTruthy();
  });

  it("support `options`", () => {
    const router = new Router();
    router.options("/", noOp);
    expect(router.find("OPTIONS", "/").handle).toBeTruthy();
  });

  it("support `trace`", () => {
    const router = new Router();
    router.trace("/", noOp);
    expect(router.find("TRACE", "/").handle).toBeTruthy();
  });

  it("support `connect`", () => {
    const router = new Router();
    router.connect("/", noOp);
    expect(router.find("CONNECT", "/").handle).toBeTruthy();
  });

  it("support wildcard `all`", () => {
    const router = new Router();
    router.all("/", noOp);
    expect(router.find("DELETE", "/").handle).toBeTruthy();
    expect(router.find("GET", "/").handle).toBeTruthy();
    expect(router.find("HEAD", "/").handle).toBeTruthy();
    expect(router.find("PATCH", "/").handle).toBeTruthy();
    expect(router.find("POST", "/").handle).toBeTruthy();
    expect(router.find("PUT", "/").handle).toBeTruthy();
    expect(router.find("OPTIONS", "/").handle).toBeTruthy();
    expect(router.find("TRACE", "/").handle).toBeTruthy();
    expect(router.find("CONNECT", "/").handle).toBeTruthy();
  });
});
