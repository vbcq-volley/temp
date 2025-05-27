"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/.pnpm/picocolors@1.1.1/node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS({
  "node_modules/.pnpm/picocolors@1.1.1/node_modules/picocolors/picocolors.js"(exports2, module2) {
    var p = process || {};
    var argv = p.argv || [];
    var env = p.env || {};
    var isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
    var formatter = (open, close, replace = open) => (input) => {
      let string = "" + input, index = string.indexOf(close, open.length);
      return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
    };
    var replaceClose = (string, close, replace, index) => {
      let result = "", cursor = 0;
      do {
        result += string.substring(cursor, index) + replace;
        cursor = index + close.length;
        index = string.indexOf(close, cursor);
      } while (~index);
      return result + string.substring(cursor);
    };
    var createColors = (enabled = isColorSupported) => {
      let f = enabled ? formatter : () => String;
      return {
        isColorSupported: enabled,
        reset: f("\x1B[0m", "\x1B[0m"),
        bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
        dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
        italic: f("\x1B[3m", "\x1B[23m"),
        underline: f("\x1B[4m", "\x1B[24m"),
        inverse: f("\x1B[7m", "\x1B[27m"),
        hidden: f("\x1B[8m", "\x1B[28m"),
        strikethrough: f("\x1B[9m", "\x1B[29m"),
        black: f("\x1B[30m", "\x1B[39m"),
        red: f("\x1B[31m", "\x1B[39m"),
        green: f("\x1B[32m", "\x1B[39m"),
        yellow: f("\x1B[33m", "\x1B[39m"),
        blue: f("\x1B[34m", "\x1B[39m"),
        magenta: f("\x1B[35m", "\x1B[39m"),
        cyan: f("\x1B[36m", "\x1B[39m"),
        white: f("\x1B[37m", "\x1B[39m"),
        gray: f("\x1B[90m", "\x1B[39m"),
        bgBlack: f("\x1B[40m", "\x1B[49m"),
        bgRed: f("\x1B[41m", "\x1B[49m"),
        bgGreen: f("\x1B[42m", "\x1B[49m"),
        bgYellow: f("\x1B[43m", "\x1B[49m"),
        bgBlue: f("\x1B[44m", "\x1B[49m"),
        bgMagenta: f("\x1B[45m", "\x1B[49m"),
        bgCyan: f("\x1B[46m", "\x1B[49m"),
        bgWhite: f("\x1B[47m", "\x1B[49m"),
        blackBright: f("\x1B[90m", "\x1B[39m"),
        redBright: f("\x1B[91m", "\x1B[39m"),
        greenBright: f("\x1B[92m", "\x1B[39m"),
        yellowBright: f("\x1B[93m", "\x1B[39m"),
        blueBright: f("\x1B[94m", "\x1B[39m"),
        magentaBright: f("\x1B[95m", "\x1B[39m"),
        cyanBright: f("\x1B[96m", "\x1B[39m"),
        whiteBright: f("\x1B[97m", "\x1B[39m"),
        bgBlackBright: f("\x1B[100m", "\x1B[49m"),
        bgRedBright: f("\x1B[101m", "\x1B[49m"),
        bgGreenBright: f("\x1B[102m", "\x1B[49m"),
        bgYellowBright: f("\x1B[103m", "\x1B[49m"),
        bgBlueBright: f("\x1B[104m", "\x1B[49m"),
        bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
        bgCyanBright: f("\x1B[106m", "\x1B[49m"),
        bgWhiteBright: f("\x1B[107m", "\x1B[49m")
      };
    };
    module2.exports = createColors();
    module2.exports.createColors = createColors;
  }
});

// dist/log.js
var __importDefault = exports && exports.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var console_1 = require("console");
var picocolors_1 = __importDefault(require_picocolors());
var TRACE = 10;
var DEBUG = 20;
var INFO = 30;
var WARN = 40;
var ERROR = 50;
var FATAL = 60;
var LEVEL_NAMES = {
  10: "TRACE",
  20: "DEBUG",
  30: "INFO ",
  40: "WARN ",
  50: "ERROR",
  60: "FATAL"
};
var LEVEL_COLORS = {
  10: "gray",
  20: "gray",
  30: "green",
  40: "bgYellow",
  50: "bgRed",
  60: "bgRed"
};
var console = new console_1.Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: false
});
var Logger = class {
  constructor({ debug = false, silent = false } = {}) {
    this._silent = silent || false;
    this._debug = debug || false;
    this.level = INFO;
    if (silent) {
      this.level = FATAL + 10;
    }
    if (this._debug) {
      this.level = TRACE;
    }
  }
  _writeLogOutput(level, consoleArgs) {
    let errArg;
    if (typeof consoleArgs[0] === "object") {
      errArg = consoleArgs.shift();
      if (errArg.err && errArg.err instanceof Error) {
        errArg = errArg.err;
      }
    }
    if (this._debug) {
      const str = (/* @__PURE__ */ new Date()).toISOString().substring(11, 23) + " ";
      if (level === TRACE || level >= WARN) {
        process.stderr.write(picocolors_1.default[LEVEL_COLORS[DEBUG]](str));
      } else {
        process.stdout.write(picocolors_1.default[LEVEL_COLORS[DEBUG]](str));
      }
    }
    if (level >= this.level) {
      const str = picocolors_1.default[LEVEL_COLORS[level]](LEVEL_NAMES[level]) + " ";
      if (level === TRACE || level >= WARN) {
        process.stderr.write(str);
      } else {
        process.stdout.write(str);
      }
      if (level === TRACE) {
        console.trace(...consoleArgs);
      } else if (level < INFO) {
        console.debug(...consoleArgs);
      } else if (level < WARN) {
        console.info(...consoleArgs);
      } else if (level < ERROR) {
        console.warn(...consoleArgs);
      } else {
        console.error(...consoleArgs);
      }
      if (errArg) {
        const err = errArg.stack || errArg.message;
        if (err) {
          const str2 = picocolors_1.default.yellow(err) + "\n";
          if (level === TRACE || level >= WARN) {
            process.stderr.write(str2);
          } else {
            process.stdout.write(str2);
          }
        }
      }
    }
  }
  trace(...args) {
    this._writeLogOutput(TRACE, args);
  }
  debug(...args) {
    this._writeLogOutput(DEBUG, args);
  }
  info(...args) {
    this._writeLogOutput(INFO, args);
  }
  warn(...args) {
    this._writeLogOutput(WARN, args);
  }
  error(...args) {
    this._writeLogOutput(ERROR, args);
  }
  fatal(...args) {
    this._writeLogOutput(FATAL, args);
  }
};
function createLogger(options = {}) {
  const logger2 = new Logger(options);
  logger2.d = logger2.debug;
  logger2.i = logger2.info;
  logger2.w = logger2.warn;
  logger2.e = logger2.error;
  logger2.log = logger2.info;
  return logger2;
}
exports.default = createLogger;
var logger = (option = {}) => createLogger(option);
exports.logger = logger;
