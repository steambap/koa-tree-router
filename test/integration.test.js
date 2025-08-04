import { test, describe } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import Koa from "koa";
import request from "supertest";
import Router from "../router.js";

describe("Router", () => {
  test("should work", (t, done) => {
    const app = new Koa();
    const router = new Router();
    router.get("/", function (ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    request(app.callback()).get("/").expect(200, done);
  });

  test("support multiple middleware", (t, done) => {
    const app = new Koa();
    const router = new Router();
    router.get(
      "/",
      function (ctx, next) {
        ctx.body = 1;
        next();
      },
      function (ctx) {
        ctx.body += 1;
      }
    );

    app.use(router.routes());

    request(app.callback())
      .get("/")
      .expect(200)
      .end(function (err, res) {
        strictEqual(res.body, 2);
        done(err);
      });
  });

  test("support 405 method not allowed", (t, done) => {
    const resBody = { msg: "not allowed" };
    const app = new Koa();
    const router = new Router({
      onMethodNotAllowed(ctx) {
        ctx.body = resBody;
      },
    });
    router.get("/", function (ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    request(app.callback())
      .post("/")
      .expect(405)
      .end(function (err, res) {
        deepStrictEqual(res.body, resBody);
        done(err);
      });
  });

  test("respond with 405 and correct header", (t, done) => {
    const app = new Koa();
    const router = new Router({
      onMethodNotAllowed(ctx) {
        ctx.body = {};
      },
    });

    router.get("/users", function () {});
    router.put("/users", function () {});

    app.use(router.routes());

    request(app.callback())
      .post("/users")
      .expect(405)
      .end(function (err, res) {
        strictEqual(res.header.allow, "GET, PUT");
        done(err);
      });
  });

  test("handle #", (t, done) => {
    const app = new Koa();
    const router = new Router();
    router.get("/test", function (ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    request(app.callback()).get("/test#id").expect(200, done);
  });

  test("handle ?", (t, done) => {
    const app = new Koa();
    const router = new Router();
    router.get("/test", function (ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    request(app.callback()).get("/test?id=test").expect(200, done);
  });

  test("ignore trailing slash", (t, done) => {
    const app = new Koa();
    const router = new Router({
      ignoreTrailingSlash: true,
    });
    router.get("/test", function (ctx) {
      ctx.body = "ok";
    });

    app.use(router.routes());

    request(app.callback()).get("/test/").expect(200, done);
  });
});
