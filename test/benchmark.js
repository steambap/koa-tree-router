const Benchmark = require("benchmark");
const benchmarks = require("beautify-benchmark");

const suite = new Benchmark.Suite();

const RegexRouter = require("koa-router");
const FindMyWay = require("find-my-way");
const TreeRouter = require("../router");

const regExRouter = new RegexRouter();
const findMyWay = new FindMyWay();
const treeRouter = new TreeRouter();

regExRouter.get("/api/v1/topic/:id", function() {});
findMyWay.get("/api/v1/topic/:id", function() {});
treeRouter.get("/api/v1/topic/:id", function() {});

suite
  .add("koa-router", function() {
    regExRouter.url("/api/v1/topic/1");
  })
  .add("find-my-way", function() {
    findMyWay.find("GET", "/api/v1/topic/1");
  })
  .add("tree-router", function() {
    treeRouter.find("GET", "/api/v1/topic/1");
  })
  .on("cycle", function(event) {
    benchmarks.add(event.target);
  })
  .on("start", function() {
    console.log(
      "\n  node version: %s, date: %s\n  Starting...",
      process.version,
      Date()
    );
  })
  .on("complete", function() {
    benchmarks.log();
    process.exit(0);
  })
  .run({ async: false });
