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
      const perPage = config.tag_generator.per_page;
      const paginationDir = config.pagination_dir || "page";
      const orderBy = config.tag_generator.order_by || "-date";
      const tags = locals.tags;
      let tagDir;
      const pages = tags.reduce((result, tag) => {
        if (!tag.length) return result;
        const posts = tag.posts.sort(orderBy);
        const data = pagination(tag.path, posts, {
          perPage,
          layout: ["tag", "archive", "index"],
          format: paginationDir + "/%d/",
          data: {
            tag: tag.name
          }
        });
        return result.concat(data);
      }, []);
      if (config.tag_generator.enable_index_page) {
        tagDir = config.tag_dir;
        if (tagDir[tagDir.length - 1] !== "/") {
          tagDir += "/";
        }
        pages.push({
          path: tagDir,
          layout: ["tag-index", "tag", "archive", "index"],
          posts: locals.posts,
          data: {
            base: tagDir,
            total: 1,
            current: 1,
            current_url: tagDir,
            posts: locals.posts,
            prev: 0,
            prev_link: "",
            next: 0,
            next_link: "",
            tags
          }
        });
      }
      return pages;
    };
  }
});

// index.js
hexo.config.tag_generator = Object.assign({
  per_page: hexo.config.per_page == null ? 10 : hexo.config.per_page
}, hexo.config.tag_generator);
hexo.extend.generator.register("tag", require_generator());
