import * as Koa from "koa";

declare module "koa" {
  interface Context {
    params: any;
  }
}

declare namespace Router {
  export interface IMiddleware {
    (ctx: Router.IRouterContext, next: () => Promise<any>): any;
  }
  export interface IRouterOptions {
    onMethodNotAllowed?: Router.IMiddleware;
  }
  export interface IRouterContext extends Koa.Context {
    /**
     * url params
     */
    params: any;
  }
}

declare class Router {
  /**
   * Create a new router.
   */
  constructor(opts?: Router.IRouterOptions);
  /**
   * Register a new route.
   */
  on(method: string, path: string, ...middleware: Array<Router.IMiddleware>);
  /**
   * HTTP GET method
   */
  get(path: string, ...middleware: Array<Router.IMiddleware>);
  /**
   * HTTP POST method
   */
  post(path: string, ...middleware: Array<Router.IMiddleware>);
  /**
   * HTTP PUT method
   */
  put(path: string, ...middleware: Array<Router.IMiddleware>);
  /**
   * HTTP DELETE method
   */
  delete(path: string, ...middleware: Array<Router.IMiddleware>);
  /**
   * HTTP HEAD method
   */
  head(path: string, ...middleware: Array<Router.IMiddleware>);
  /**
   * HTTP OPTIONS method
   */
  options(path: string, ...middleware: Array<Router.IMiddleware>);
  /**
   * HTTP PATCH method
   */
  patch(path: string, ...middleware: Array<Router.IMiddleware>);
  /**
   * HTTP TRACE method
   */
  trace(path: string, ...middleware: Array<Router.IMiddleware>);
  /**
   * HTTP CONNECT method
   */
  connect(path: string, ...middleware: Array<Router.IMiddleware>);
  /**
   * Register route with all methods.
   */
  all(path: string, ...middleware: Array<Router.IMiddleware>);
  /**
   * Returns router middleware.
   */
  routes(): Router.IMiddleware;
}

export = Router;
