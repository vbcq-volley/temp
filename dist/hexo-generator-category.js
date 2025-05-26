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
      const perPage = config.category_generator.per_page;
      const paginationDir = config.pagination_dir || "page";
      const orderBy = config.category_generator.order_by || "-date";
      return locals.categories.reduce((result, category) => {
        if (!category.length) return result;
        const posts = category.posts.sort(orderBy);
        const data = pagination(category.path, posts, {
          perPage,
          layout: ["category", "archive", "index"],
          format: paginationDir + "/%d/",
          data: {
            category: category.name
          }
        });
        return result.concat(data);
      }, []);
    };
  }
});

// index.js
hexo.config.category_generator = Object.assign({
  per_page: typeof hexo.config.per_page === "undefined" ? 10 : hexo.config.per_page
}, hexo.config.category_generator);
hexo.extend.generator.register("category", require_generator());
