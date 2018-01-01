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

function Router() {
  if (!(this instanceof Router)) {
    return new Router();
  }

  this.trees = [];
}

Router.prototype.on = function(method, path, ...handle) {
  if (path[0] !== "/") {
    throw new Error("path must begin with '/' in path");
  }

  if (!this.trees[method]) {
    this.trees[method] = new Node();
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
    const {handle, params} = router.find(ctx.method, ctx.path);
    if (!handle) {
      return next();
    }

    ctx.params = {};
    params.forEach(({key, value}) => {
      ctx.params[key] = value;
    });

    return compose(handle)(ctx, next);
  };

  return handle;
};

module.exports = Router;
