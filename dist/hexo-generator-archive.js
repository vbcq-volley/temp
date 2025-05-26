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
    var fmtNum = (num) => num.toString().padStart(2, "0");
    module2.exports = function(locals) {
      const { config } = this;
      let archiveDir = config.archive_dir;
      const paginationDir = config.pagination_dir || "page";
      const allPosts = locals.posts.sort(config.archive_generator.order_by || "-date");
      const perPage = config.archive_generator.per_page;
      const result = [];
      if (!allPosts.length) return;
      if (archiveDir[archiveDir.length - 1] !== "/") archiveDir += "/";
      function generate(path, posts2, options = {}) {
        options.archive = true;
        result.push(...pagination(path, posts2, {
          perPage,
          layout: ["archive", "index"],
          format: paginationDir + "/%d/",
          data: options
        }));
      }
      generate(archiveDir, allPosts);
      if (!config.archive_generator.yearly) return result;
      const posts = {};
      allPosts.forEach((post) => {
        const date = post.date;
        const year2 = date.year();
        const month2 = date.month() + 1;
        if (!Object.prototype.hasOwnProperty.call(posts, year2)) {
          posts[year2] = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
          ];
        }
        posts[year2][0].push(post);
        posts[year2][month2].push(post);
        if (config.archive_generator.daily) {
          const day = date.date();
          if (!Object.prototype.hasOwnProperty.call(posts[year2][month2], "day")) {
            posts[year2][month2].day = {};
          }
          (posts[year2][month2].day[day] || (posts[year2][month2].day[day] = [])).push(post);
        }
      });
      const { Query } = this.model("Post");
      const years = Object.keys(posts);
      let year, data, month, monthData, url;
      for (let i = 0, len = years.length; i < len; i++) {
        year = +years[i];
        data = posts[year];
        url = archiveDir + year + "/";
        if (!data[0].length) continue;
        generate(url, new Query(data[0]), { year });
        if (!config.archive_generator.monthly && !config.archive_generator.daily) continue;
        for (month = 1; month <= 12; month++) {
          monthData = data[month];
          if (!monthData.length) continue;
          if (config.archive_generator.monthly) {
            generate(url + fmtNum(month) + "/", new Query(monthData), {
              year,
              month
            });
          }
          if (!config.archive_generator.daily) continue;
          for (let day = 1; day <= 31; day++) {
            const dayData = monthData.day[day];
            if (!dayData || !dayData.length) continue;
            generate(url + fmtNum(month) + "/" + fmtNum(day) + "/", new Query(dayData), {
              year,
              month,
              day
            });
          }
        }
      }
      return result;
    };
  }
});

// index.js
if (!(hexo.config.archive_generator && hexo.config.archive_generator.enabled === false)) {
  let per_page;
  if (hexo.config.archive === 1) {
    per_page = 0;
  } else if (typeof hexo.config.per_page === "undefined") {
    per_page = 10;
  } else {
    per_page = hexo.config.per_page;
  }
  hexo.config.archive_generator = Object.assign({
    per_page,
    yearly: true,
    monthly: true,
    daily: false
  }, hexo.config.archive_generator);
  hexo.extend.generator.register("archive", require_generator());
}
