const expect = require("expect");
const Router = require("../router");
const RouteGroup = require("../routegroup");

const noOp = [function() {}];

describe("Route Group", () => {
  it("works!", () => {
    const r = new Router();
    const group = new RouteGroup(r, "/foo");
    group.get("/bar", noOp);
    expect(r.find("GET", "/foo/bar").handle).toBeTruthy();
  });
});
