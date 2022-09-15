const http = require("http");
const compose = require("koa-compose");
const Node = require("./tree");
const RouteGroup = require("./routegroup");

const httpMethods = http.METHODS;
const NOT_FOUND = { handle: null, params: [] };

function trimLastSlash(path) {
  if (path.length > 1 && path.charCodeAt(path.length - 1) === 47) {
    return path.slice(0, -1);
  }
  return path;
}

class Router {
  constructor(opts = {}) {
    if (!(this instanceof Router)) {
      return new Router(opts);
    }
    this.handlers = [];
    this.trees = {};
    this.opts = opts;
  }
  on(method, path, ...handle) {
    if (path[0] !== "/") {
      throw new Error("path must begin with '/' in path");
    }
    handle.unshift(...this.handlers);
    if (!this.trees[method]) {
      this.trees[method] = new Node();
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
    httpMethods.forEach((method) => {
      this.on(method, ...arg);
    });
    return this;
  }
  use(...handle) {
    this.handlers.push(...handle);
  }
  find(method, path) {
    const tree = this.trees[method];
    if (tree) {
      if (this.opts.ignoreTrailingSlash) {
        path = trimLastSlash(path);
      }
      return tree.search(path);
    }
    return NOT_FOUND;
  }
  routes() {
    const router = this;
    const handle = function (ctx, next) {
      const { handle, params } = router.find(ctx.method, ctx.path);
      if (!handle) {
        const handle405 = router.opts.onMethodNotAllowed;
        if (handle405) {
          const allowList = [];
          // Search for allowed methods
          for (let key in router.trees) {
            if (key === ctx.method) {
              continue;
            }
            const tree = router.trees[key];
            if (tree.search(ctx.path).handle !== null) {
              allowList.push(key);
            }
          }
          ctx.status = 405;
          ctx.set("Allow", allowList.join(", "));
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
  /**
   * @param {string} path
   */
  newGroup(path) {
    return new RouteGroup(this, path, this.handlers);
  }
}

module.exports = Router;
