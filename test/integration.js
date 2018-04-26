const Koa = require("koa");
const request = require("supertest");
const expect = require("expect");
const Router = require("../router");

describe("Router", () => {
  it("should work", done => {
    const app = new Koa();
    const router = new Router();
    router.get("/", function(ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    request(app.callback())
      .get("/")
      .expect(200, done);
  });

  it("support multiple middleware", done => {
    const app = new Koa();
    const router = new Router();
    router.get(
      "/",
      function(ctx, next) {
        ctx.body = 1;
        next();
      },
      function(ctx) {
        ctx.body += 1;
      }
    );

    app.use(router.routes());

    request(app.callback())
      .get("/")
      .expect(200)
      .end(function(err, res) {
        expect(res.body).toEqual(2);
        done(err);
      });
  });

  it("support 405 method not allowed", done => {
    const resBody = { msg: "not allowed" };
    const app = new Koa();
    const router = new Router({
      onMethodNotAllowed(ctx) {
        ctx.body = resBody;
      }
    });
    router.get("/", function(ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    request(app.callback())
      .post("/")
      .expect(405)
      .end(function(err, res) {
        expect(res.body).toMatchObject(resBody);
        done(err);
      });
  });

  it("respond with 405 and correct header", done => {
    const app = new Koa();
    const router = new Router({
      onMethodNotAllowed(ctx) {
        ctx.body = {};
      }
    });

    router.get("/users", function() {});
    router.put("/users", function() {});

    app.use(router.routes());

    request(app.callback())
      .post("/users")
      .expect(405)
      .end(function(err, res) {
        expect(res.header).toHaveProperty("allow", "GET, PUT");
        done(err);
      });
  });

  it("support prefixing all routes", () => {
    const app = new Koa();
    const router = new Router({ prefix: "/api" });

    router.get("/", function(ctx) {
      ctx.body = "ok";
    });

    router.get("/cars", function(ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    const callback = app.callback();

    return Promise.all([
      request(callback)
        .get("/api/")
        .expect(200),
      request(callback)
        .get("/api/cars")
        .expect(200)
    ]);
  });

  it("handle #", done => {
    const app = new Koa();
    const router = new Router();
    router.get("/test", function(ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    request(app.callback())
      .get("/test#id")
      .expect(200, done);
  });

  it("handle ?", done => {
    const app = new Koa();
    const router = new Router();
    router.get("/test", function(ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    request(app.callback())
      .get("/test?id=test")
      .expect(200, done);
  });
});
