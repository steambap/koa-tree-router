const http = require("http");
const compose = require("koa-compose");
const Node = require("./tree");
const RouteGroup = require("./routegroup");

const httpMethods = http.METHODS;
const NOT_FOUND = { handle: null, params: [] };

class Router {
  constructor(opts = {}) {
    if (!(this instanceof Router)) {
      return new Router(opts);
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
  find(method, path) {
    const tree = this.trees[method];
    if (tree) {
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
   * todo remove
   * @param {String} prefix
   */
  mount(prefix) {
    if (prefix[0] !== "/") {
      throw new Error("path must begin with '/' in path");
    }
    const downstream = this.routes();

    // don't need to do mounting here
    if (prefix === "/") return downstream;

    const trailingSlash = prefix.slice(-1) === "/";

    return async function (ctx, upstream) {
      const prev = ctx.path;
      const newPath = match(prev);
      if (!newPath) return upstream();

      ctx.mountPath = prefix;
      ctx.path = newPath;

      await downstream(ctx, async () => {
        ctx.path = prev;
        await upstream();
        ctx.path = newPath;
      });

      ctx.path = prev;
    };

    /**
     * Check if `prefix` satisfies a `path`.
     * Returns the new path.
     *
     * match('/images/', '/lkajsldkjf') => false
     * match('/images', '/images') => /
     * match('/images/', '/images') => false
     * match('/images/', '/images/asdf') => /asdf
     *
     * @param {String} prefix
     * @param {String} path
     * @return {String|Boolean}
     * @api private
     */
    function match(path) {
      // does not match prefix at all
      if (path.indexOf(prefix) !== 0) return false;

      const newPath = path.replace(prefix, "") || "/";
      if (trailingSlash) return newPath;

      // `/mount` does not match `/mountlkjalskjdf`
      if (newPath[0] !== "/") return false;
      return newPath;
    }
  }
  /**
   * @param {string} path
   */
  newGroup(path) {
    return new RouteGroup(this, path);
  }
}

module.exports = Router;
