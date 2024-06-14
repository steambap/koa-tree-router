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
    it(data.route, () => {
      const { handle } = tree.search(data.route);
      if (data.found) {
        expect(handle).toBeTruthy();
      } else {
        expect(handle).toBeNull;
      }
    });
  });
});

describe("Wildcard", () => {
  const tree = new Tree();
  const routes = [
    {
      route: "/",
      found: [
        {
          route: "/",
          params: []
        },
      ],
    },
    {
      route: "/cmd/foo/bar",
      found: [
        {
          route: "/cmd/foo/bar",
          params: []
        },
      ],
    },
    {
      route: "/cmd/a_:tool",
      found: [
        {
          route: "/cmd/a_test",
          params: [{ key: "tool", value: "test" }]
        },
      ],
    },
    {
      route: "/cmd/:tool/",
      found: [
        {
          route: "/cmd/test/",
          params: [{ key: "tool", value: "test" }]
        },
      ],
    },
    {
      route: "/cmd/:tool/:sub",
      found: [
        {
          route: "/cmd/test/3",
          params: [{ key: "tool", value: "test" }, { key: "sub", value: "3" }]
        },
      ],
    },
    {
      route: "/src/*filepath",
      found: [
        {
          route: "/src/",
          params: [{ key: "filepath", value: "/" }]
        },
        {
          route: "/src/some/file.png",
          params: [{ key: "filepath", value: "/some/file.png" }]
        },
      ],
    },
    {
      route: "/search/",
      found: [
        {
          route: "/search/",
          params: []
        },
      ],
    },
    {
      route: "/search/:query",
      found: [
        {
          route: "/search/中文",
          params: [{ key: "query", value: "中文" }]
        },
      ],
    },
    {
      route: "/user_:name",
      found: [
        {
          route: "/user_noder",
          params: [{ key: "name", value: "noder" }]
        },
      ],
    },
    {
      route: "/user_:name/about",
      found: [
        {
          route: "/user_noder/about",
          params: [{ key: "name", value: "noder" }]
        },
      ],
    },
    {
      route: "/files/:dir/*filepath",
      found: [
        {
          route: "/files/js/inc/framework.js",
          params: [
            { key: "dir", value: "js" },
            { key: "filepath", value: "/inc/framework.js" }
          ]
        },
      ],
    },
    {
      route: "/doc/",
      found: [],
    },
    {
      route: "/doc/node_faq.html",
      found: [],
    },
    {
      route: "/doc/node1.html",
      found: [],
    },
    {
      route: "/info/:user/public",
      found: [
        {
          route: "/info/gordon/public",
          params: [{ key: "user", value: "gordon" }]
        },
      ],
    },
    {
      route: "/info/:user/project/:project",
      found: [
        {
          route: "/info/gordon/project/node",
          params: [
            { key: "user", value: "gordon" },
            { key: "project", value: "node" }
          ]
        },
      ],
    },
  ];

  routes.forEach((route) => {
    route.handle = noOp.slice(0) // creating an unique handle
    tree.addRoute(route.route, route.handle);
  });

  // tree.printTree();

  routes.forEach((route) => {
    route.found.forEach((data) => {
      it(data.route, () => {
        const { handle, params } = tree.search(data.route);
        expect(handle).toBe(route.handle);
        expect(params).toMatchObject(data.params);
      });
    })
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
    it(data.route, () => {
      const { handle, params } = tree.search(data.route);
      expect(handle).toBeNull();
      expect(params).toMatchObject(data.params);
    });
  });
});

describe("Invalid", () => {
  it("node type", () => {
    const tree = new Tree();
    tree.addRoute("/", noOp);
    tree.addRoute("/:page", noOp);

    tree.children[0].type = 42;

    expect(() => tree.search("/test")).toThrow();
  });

  it("conflict", () => {
    const tree = new Tree();
    tree.addRoute("/src3/*filepath", noOp);

    expect(() => tree.addRoute("/src3/*filepath/x", noOp)).toThrow();
  })
});
