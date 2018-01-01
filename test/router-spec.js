const expect = require("expect");
const Router = require("../router");

const noOp = [function() {}];

describe("Router", () => {
  it("works!", () => {
    expect(Router()).toBeInstanceOf(Router);
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

  it("support wildcard `all`", () => {
    const router = new Router();
    router.all("/", noOp);
    expect(router.find("GET", "/").handle).toBeTruthy();
    expect(router.find("POST", "/").handle).toBeTruthy();
  });
});
