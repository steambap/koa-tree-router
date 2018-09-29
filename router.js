const http = require("http");
const compose = require("koa-compose");
const Node = require("./tree");

const httpMethods = http.METHODS;
const NOT_FOUND = { handle: null, params: [] };

class Router {
  constructor(opts = {}) {
    if (!(this instanceof Router)) {
      return new Router(opts);
    }
    if (opts.prefix && opts.prefix[0] !== "/") {
      throw new Error("prefix must begin with '/' in path");
    }
    this.trees = {};
    this.opts = opts;
  }
  on(method, path, ...handle) {
    if (path[0] !== "/") {
      throw new Error("path must begin with '/' in path");
    }
    if (!this.trees[method]) {
      this.trees[method] = new Node();
    }
    if (this.opts.prefix) {
      path = this.opts.prefix + path;
    }
    this.trees[method].addRoute(path, handle);
    return this;
  }
  get(...arg) {
    return this.on("GET", ...arg);
  }
  put(...arg) {
    return this.on("PUT", ...arg);
  }
  post(...arg) {
    return this.on("POST", ...arg);
  }
  delete(...arg) {
    return this.on("DELETE", ...arg);
  }
  head(...arg) {
    return this.on("HEAD", ...arg);
  }
  patch(...arg) {
    return this.on("PATCH", ...arg);
  }
  options(...arg) {
    return this.on("OPTIONS", ...arg);
  }
  trace(...arg) {
    return this.on("TRACE", ...arg);
  }
  connect(...arg) {
    return this.on("CONNECT", ...arg);
  }
  all(...arg) {
    httpMethods.forEach(method => {
      this.on(method, ...arg);
    });
    return this;
  }
  find(method, path) {
    const tree = this.trees[method];
    if (tree) {
      return tree.search(path);
    }
    return NOT_FOUND;
  }
  getAllowedMethods(path, exclude) {
    const allowList = [];
    // Search for allowed methods
    for (let key in this.trees) {
      if (key === exclude) {
        continue;
      }
      const tree = this.trees[key];
      if (tree.search(path).handle !== null) {
        allowList.push(key);
      }
    }
    return allowList;
  }
  routes() {
    const router = this;
    const handle = function(ctx, next) {
      const { handle, params } = router.find(ctx.method, ctx.path);
      if (!handle) {
        const handle405 = router.opts.onMethodNotAllowed;
        if (handle405) {
          ctx.status = 405;
          const allow = router.getAllowedMethods(ctx.path, ctx.method);
          ctx.set("Allow", allow.join(", "));
          return handle405(ctx, next);
        }
        return next();
      }
      ctx.params = {};
      params.forEach(({ key, value }) => {
        ctx.params[key] = value;
      });
      return compose(handle)(ctx, next);
    };
    return handle;
  }
  middleware() {
    return this.routes();
  }
}

module.exports = Router;
