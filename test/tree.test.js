const { test, describe } = require("node:test");
const assert = require("node:assert");
const Tree = require("../tree");

Tree.prototype.printTree = function(prefix = "") {
  console.log(
    " %d %s%s[%d] %s %s %d \r\n",
    this.priority,
    prefix,
    this.path,
    this.children.length,
    this.handle,
    this.wildChild,
    this.type
  );
  for (let l = this.path.length; l > 0; l--) {
    prefix += " ";
  }
  this.children.forEach(child => {
    child.printTree(prefix);
  });
};

const noOp = [function() {}];

describe("Add and get", () => {
  const tree = new Tree();
  const routes = [
    "/hi",
    "/contact",
    "/co",
    "/c",
    "/a",
    "/ab",
    "/doc/",
    "/doc/node_faq.html",
    "/doc/node1.html",
    "/α",
    "/β"
  ];

  routes.forEach(route => {
    tree.addRoute(route, noOp);
  });

  // tree.printTree();

  const testData = [
    {
      route: "/a",
      found: true
    },
    {
      route: "/",
      found: false
    },
    {
      route: "/hi",
      found: true
    },
    {
      route: "/contact",
      found: true
    },
    {
      route: "/co",
      found: true
    },
    {
      route: "/con",
      found: false
    },
    {
      route: "/cona",
      found: false
    },
    {
      route: "/no",
      found: false
    },
    {
      route: "/ab",
      found: true
    },
    {
      route: "/α",
      found: true
    },
    {
      route: "/β",
      found: true
    }
  ];

  testData.forEach(data => {
    test(data.route, () => {
      const { handle } = tree.search(data.route);
      if (data.found) {
        assert(handle);
      } else {
        assert.strictEqual(handle, null);
      }
    });
  });
});

describe("Wildcard", () => {
  const tree = new Tree();
  const routes = [
    "/",
    "/cmd/:tool/:sub",
    "/cmd/:tool/",
    "/src/*filepath",
    "/search/",
    "/search/:query",
    "/user_:name",
    "/user_:name/about",
    "/files/:dir/*filepath",
    "/doc/",
    "/doc/node_faq.html",
    "/doc/node1.html",
    "/info/:user/public",
    "/info/:user/project/:project"
  ];

  routes.forEach(route => {
    tree.addRoute(route, noOp);
  });

  // tree.printTree();

  const foundData = [
    {
      route: "/",
      params: []
    },
    {
      route: "/cmd/test/",
      params: [{ key: "tool", value: "test" }]
    },
    {
      route: "/cmd/test/3",
      params: [{ key: "tool", value: "test" }, { key: "sub", value: "3" }]
    },
    {
      route: "/src/",
      params: [{ key: "filepath", value: "/" }]
    },
    {
      route: "/src/some/file.png",
      params: [{ key: "filepath", value: "/some/file.png" }]
    },
    {
      route: "/search/",
      params: []
    },
    {
      route: "/search/中文",
      params: [{ key: "query", value: "中文" }]
    },
    {
      route: "/user_noder",
      params: [{ key: "name", value: "noder" }]
    },
    {
      route: "/user_noder/about",
      params: [{ key: "name", value: "noder" }]
    },
    {
      route: "/files/js/inc/framework.js",
      params: [
        { key: "dir", value: "js" },
        { key: "filepath", value: "/inc/framework.js" }
      ]
    },
    {
      route: "/info/gordon/public",
      params: [{ key: "user", value: "gordon" }]
    },
    {
      route: "/info/gordon/project/node",
      params: [
        { key: "user", value: "gordon" },
        { key: "project", value: "node" }
      ]
    }
  ];

  foundData.forEach(data => {
    test(data.route, () => {
      const { handle, params } = tree.search(data.route);
      assert(handle);
      assert.deepStrictEqual(params, data.params);
    });
  });

  const noHandlerData = [
    {
      route: "/cmd/test",
      params: [{ key: "tool", value: "test" }]
    },
    {
      route: "/search/中文/",
      params: [{ key: "query", value: "中文" }]
    }
  ];

  noHandlerData.forEach(data => {
    test(data.route, () => {
      const { handle, params } = tree.search(data.route);
      assert.strictEqual(handle, null);
      assert.deepStrictEqual(params, data.params);
    });
  });
});

describe("Invalid", () => {
  test("node type", () => {
    const tree = new Tree();
    tree.addRoute("/", noOp);
    tree.addRoute("/:page", noOp);

    tree.children[0].type = 42;

    assert.throws(() => tree.search("/test"));
  });

  test("conflict", () => {
    const tree = new Tree();
    tree.addRoute("/src3/*filepath", noOp);

    assert.throws(() => tree.addRoute("/src3/*filepath/x", noOp));
  })
});
