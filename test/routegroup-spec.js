const expect = require("expect");
const Router = require("../router");
const RouteGroup = require("../routegroup");

const noOp = function () {};

describe("Route Group", () => {
  it("works!", () => {
    const r = new Router();
    const group = new RouteGroup(r, "/foo");
    group.get("/bar", noOp);
    expect(r.find("GET", "/foo/bar").handle).toBeTruthy();
  });

  it("works in router", () => {
    const r = new Router();
    const group = r.newGroup("/bar");
    group.post("/", noOp);
    group.get("/foo", noOp);
    expect(r.find("POST", "/bar").handle).toBeTruthy();
    expect(r.find("GET", "/bar/foo").handle).toBeTruthy();
  });

  it("uses middleware from `use` in `on`", () => {
    const r = new Router();
    const group = new RouteGroup(r, "/foo");
    group.use(noOp);
    group.get("/bar", noOp);
    expect(r.find("GET", "/foo/bar").handle).toBeTruthy();
    expect(r.find("GET", "/foo/bar").handle).toHaveLength(2);
  });

  it("works with multiple handle", () => {
    const r = new Router();
    const group = new RouteGroup(r, "/foo");
    group.get("/bar", noOp, noOp, noOp);
    expect(r.find("GET", "/foo/bar").handle).toHaveLength(3);
  });
});
