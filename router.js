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

Router.prototype.on = function(method, path, handle) {
  if (path[0] !== "/") {
    throw new Error("path must begin with '/' in path");
  }

  if (!this.trees[method]) {
    this.trees[method] = new Node("", false, 0, 0, "", [], null, 0);
  }

  this.trees[method].addRoute(path, handle);

  return this;
};

Router.prototype.get = function(path, handle) {
  return this.on("GET", path, handle);
};

Router.prototype.put = function(path, handle) {
  return this.on("PUT", path, handle);
};

Router.prototype.post = function(path, handle) {
  return this.on("POST", path, handle);
};

Router.prototype.delete = function(path, handle) {
  return this.on("DELETE", path, handle);
};

Router.prototype.find = function(method, path) {
  const tree = this.trees[method];
  if (tree) {
    return tree.search(path);
  }

  return { handle: null, params: [] };
};

module.exports = Router;
