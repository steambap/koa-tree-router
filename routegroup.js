import { METHODS } from "node:http";

class RouteGroup {
  /**
   *
   * @param {*} router
   * @param {string} path
   */
  constructor(router, path, handlers = []) {
    if (path[0] !== "/") {
      throw new Error("path must begin with '/' in path '" + path + "'");
    }
    //Strip trailing / (if present) as all added sub paths must start with a /
    if (path[path.length - 1] === "/") {
      path = path.substr(0, path.length - 1);
    }
    this.handlers = [...handlers];
    this.r = router;
    this.p = path;
  }
  /**
   * @param {string} path
   */
  subpath(path) {
    if (path[0] !== "/") {
      throw new Error("path must start with a '/'");
    }
    if (path === "/") {
      return this.p;
    }
    return this.p + path;
  }
  /**
   *
   * @param {string} path
   */
  newGroup(path) {
    return new RouteGroup(this.r, this.subpath(path), this.handlers);
  }
  on(method, path, ...handle) {
    handle.unshift(...this.handlers);
    this.r.on(method, this.subpath(path), ...handle);
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
    METHODS.forEach((method) => {
      this.on(method, ...arg);
    });
    return this;
  }
  use(...handle) {
    this.handlers.push(...handle);
  }
  routes() {
    return this.r.routes();
  }
}

export default RouteGroup;
