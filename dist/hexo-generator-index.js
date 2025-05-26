"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/.pnpm/hexo-pagination@3.0.0/node_modules/hexo-pagination/lib/pagination.js
var require_pagination = __commonJS({
  "node_modules/.pnpm/hexo-pagination@3.0.0/node_modules/hexo-pagination/lib/pagination.js"(exports2, module2) {
    "use strict";
    var { format } = require("util");
    function pagination(base, posts, options = {}) {
      if (typeof base !== "string") throw new TypeError("base must be a string!");
      if (!posts) throw new TypeError("posts is required!");
      if (base && !base.endsWith("/")) base += "/";
      const { length } = posts;
      const { format: _format, layout, data, perPage } = Object.assign({
        format: "page/%d/",
        layout: ["archive", "index"],
        data: {},
        perPage: 10
      }, options);
      const total = perPage ? Math.ceil(length / perPage) : 1;
      const result = [];
      const urlCache = /* @__PURE__ */ new Map();
      function formatURL(i) {
        if (urlCache.has(i)) return urlCache.get(i);
        const url = i > 1 ? base + format(_format, i) : base;
        urlCache.set(i, url);
        return url;
      }
      function makeData(i) {
        const data2 = {
          base,
          total,
          current: i,
          current_url: formatURL(i),
          posts: perPage ? posts.slice(perPage * (i - 1), perPage * i) : posts,
          prev: 0,
          prev_link: "",
          next: 0,
          next_link: ""
        };
        if (i > 1) {
          data2.prev = i - 1;
          data2.prev_link = formatURL(data2.prev);
        }
        if (i < total) {
          data2.next = i + 1;
          data2.next_link = formatURL(data2.next);
        }
        return data2;
      }
      if (perPage) {
        for (let i = 1; i <= total; i++) {
          result.push({
            path: formatURL(i),
            layout,
            data: Object.assign(makeData(i), data)
          });
        }
      } else {
        result.push({
          path: base,
          layout,
          data: Object.assign(makeData(1), data)
        });
      }
      return result;
    }
    module2.exports = pagination;
  }
});

// lib/generator.js
var require_generator = __commonJS({
  "lib/generator.js"(exports2, module2) {
    "use strict";
    var pagination = require_pagination();
    module2.exports = function(locals) {
      const config = this.config;
      const posts = locals.posts.sort(config.index_generator.order_by);
      posts.data.sort((a, b) => (b.sticky || 0) - (a.sticky || 0));
      const paginationDir = config.index_generator.pagination_dir || config.pagination_dir || "page";
      const path = config.index_generator.path || "";
      return pagination(path, posts, {
        perPage: config.index_generator.per_page,
        layout: config.index_generator.layout || ["index", "archive"],
        format: paginationDir + "/%d/",
        data: {
          __index: true
        }
      });
    };
  }
});

// index.js
hexo.config.index_generator = Object.assign({
  per_page: typeof hexo.config.per_page === "undefined" ? 10 : hexo.config.per_page,
  order_by: "-date",
  layout: ["index", "archive"]
}, hexo.config.index_generator);
hexo.extend.generator.register("index", require_generator());
