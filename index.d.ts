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

  get(path: string, ...middleware: Array<Router.IMiddleware>);
  post(path: string, ...middleware: Array<Router.IMiddleware>);
  put(path: string, ...middleware: Array<Router.IMiddleware>);
  delete(path: string, ...middleware: Array<Router.IMiddleware>);
  head(path: string, ...middleware: Array<Router.IMiddleware>);
  options(path: string, ...middleware: Array<Router.IMiddleware>);
  patch(path: string, ...middleware: Array<Router.IMiddleware>);
  trace(path: string, ...middleware: Array<Router.IMiddleware>);
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
