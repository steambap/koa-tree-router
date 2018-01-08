const compose = require("koa-compose");
const Node = require("./tree");
const httpMethods = [
  "DELETE",
  "GET",
  "HEAD",
  "PATCH",
  "POST",
  "PUT",
  "OPTIONS",
  "TRACE",
  "CONNECT"
];

function Router(opts = {}) {
  if (!(this instanceof Router)) {
    return new Router(opts);
  }

  if (opts.prefix && opts.prefix[0] !== "/") {
    throw new Error("prefix must begin with '/' in path");
  }

  this.trees = {};
  this.opts = opts;
}

Router.prototype.on = function(method, path, ...handle) {
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
};

Router.prototype.get = function(...arg) {
  return this.on("GET", ...arg);
};

Router.prototype.put = function(...arg) {
  return this.on("PUT", ...arg);
};

Router.prototype.post = function(...arg) {
  return this.on("POST", ...arg);
};

Router.prototype.delete = function(...arg) {
  return this.on("DELETE", ...arg);
};

Router.prototype.head = function(...arg) {
  return this.on("HEAD", ...arg);
};

Router.prototype.patch = function(...arg) {
  return this.on("PATCH", ...arg);
};

Router.prototype.options = function(...arg) {
  return this.on("OPTIONS", ...arg);
};

Router.prototype.trace = function(...arg) {
  return this.on("TRACE", ...arg);
};

Router.prototype.connect = function(...arg) {
  return this.on("CONNECT", ...arg);
};

Router.prototype.all = function(...arg) {
  httpMethods.forEach(method => {
    this.on(method, ...arg);
  });
};

Router.prototype.find = function(method, path) {
  const tree = this.trees[method];
  if (tree) {
    return tree.search(path);
  }

  return { handle: null, params: [] };
};

Router.prototype.routes = Router.prototype.middleware = function() {
  const router = this;

  const handle = function(ctx, next) {
    const { handle, params } = router.find(ctx.method, ctx.path);
    if (!handle) {
      const handle405 = router.opts.onMethodNotAllowed;
      if (handle405) {
        for (let key in router.trees) {
          if (key === ctx.method) {
            continue;
          }

          const tree = router.trees[key];
          if (tree.search(ctx.path).handle !== null) {
            ctx.status = 405;

            return handle405(ctx, next);
          }
        }
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
};

module.exports = Router;
