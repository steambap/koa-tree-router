import * as Koa from "koa";

declare namespace Router {
  export interface IRouterOptions<StateT = any, CustomT = {}> {
    onMethodNotAllowed?: Router.Middleware<StateT, CustomT>;
    ignoreTrailingSlash?: Boolean;
  }
  export interface IRouterParamContext<StateT = any, CustomT = {}> {
    /**
     * url params
     */
    params: { [key: string]: string };
    /**
     * the router instance
     */
    router: Router<StateT, CustomT>;
  }
  export type RouterContext<
    StateT = any,
    CustomT = {}
  > = Koa.ParameterizedContext<
    StateT,
    CustomT & IRouterParamContext<StateT, CustomT>
  >;
  export interface IRouterContext extends RouterContext {}
  export type Middleware<StateT = any, CustomT = {}> = Koa.Middleware<
    StateT,
    CustomT & IRouterParamContext<StateT, CustomT>
  >;
}

declare class Router<StateT = any, CustomT = {}> {
  /**
   * Create a new router.
   */
  constructor(opts?: Router.IRouterOptions<StateT, CustomT>);
  /**
   * Register a new route.
   */
  on(
    method: string,
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP GET method
   */
  get(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP POST method
   */
  post(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP PUT method
   */
  put(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP DELETE method
   */
  delete(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP HEAD method
   */
  head(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP OPTIONS method
   */
  options(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP PATCH method
   */
  patch(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP TRACE method
   */
  trace(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP CONNECT method
   */
  connect(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * Prepend handlers to all future routes
   * Must be called before register new handlers
   */
  use( ...middleware: Array<Router.Middleware<StateT, CustomT>>): void;
  /**
   * Register route with all methods.
   */
  all(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * Returns router middleware.
   */
  routes(): Router.Middleware<StateT, CustomT>;
  /**
   * Create groups of routes
   */
  newGroup(path: string): RouteGroup<StateT, CustomT>;
}

declare class RouteGroup<StateT = any, CustomT = {}> {
  /**
   * Create a new router.
   */
  constructor(router: Router<StateT, CustomT>, path: string);
  /**
   * Register a new route.
   */
  on(
    method: string,
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP GET method
   */
  get(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP POST method
   */
  post(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP PUT method
   */
  put(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP DELETE method
   */
  delete(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP HEAD method
   */
  head(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP OPTIONS method
   */
  options(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP PATCH method
   */
  patch(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP TRACE method
   */
  trace(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * HTTP CONNECT method
   */
  connect(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * Register route with all methods.
   */
  all(
    path: string,
    ...middleware: Array<Router.Middleware<StateT, CustomT>>
  ): this;
  /**
   * Prepend handlers to all future routes in the group
   * Must be called before register new handlers
   */
  use( ...middleware: Array<Router.Middleware<StateT, CustomT>>): void;
  /**
   * Returns router middleware.
   */
  routes(): Router.Middleware<StateT, CustomT>;
  /**
   * Create groups of routes
   */
  newGroup(path: string): RouteGroup<StateT, CustomT>;
}

export = Router;
