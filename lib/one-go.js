'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OG = function OG(args) {
  _classCallCheck(this, OG);

  this.args = args.map(function (arg) {
    return Array.isArray(arg) ? arg : [arg];
  });
};

var ogArgs = exports.ogArgs = function ogArgs() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new OG(args);
};

var _init = Symbol();
var _elements = Symbol();

var OneGo = function OneGo(Class) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  function makeList(Class, options) {
    var List = void 0;

    if (options.arrayInit) {
      List = function List(args) {
        this[_init](args);
      };
    } else {
      List = function List() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        this[_init](args);
      };
    }

    List.prototype[_init] = function (args) {
      // Use a symbol so it won't be overridden
      this[_elements] = args.map(function (arg) {
        if (arg instanceof Class) {
          return arg;
        }

        if (Array.isArray(arg)) {
          return new (Function.prototype.bind.apply(Class, [null].concat(_toConsumableArray(arg))))();
        }

        return new Class(arg);
      });

      Object.defineProperties(this, {
        elements: {
          get: function get() {
            return [].concat(_toConsumableArray(this[_elements]));
          }
        }
      });
    };

    var proto = {};

    Object.getOwnPropertyNames(Class.prototype).forEach(function (prop) {
      proto[prop] = Class.prototype[prop];
    });

    if (options.parallel) {
      Object.assign(proto, options.parallel);
    }

    Object.getOwnPropertyNames(proto).forEach(function (prop) {
      if (typeof proto[prop] === 'function' && prop !== 'constructor') {
        List.prototype[prop] = function (args0) {
          var _this = this;

          for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            args[_key3 - 1] = arguments[_key3];
          }

          var results = void 0;

          if (args0 instanceof OG) {
            (function () {
              var argsi = args0.args;

              if (argsi.length !== _this[_elements].length) {
                throw new Error('Number of elements in list and number of args don\'t match');
              }

              results = _this[_elements].map(function (element, ith) {
                return proto[prop].apply(element, argsi[ith]);
              });
            })();
          } else {
            results = this[_elements].map(function (element) {
              return proto[prop].apply(element, [args0].concat(args));
            });
          }

          for (var nth = 0, len = results.length; nth < len; nth++) {
            // Don't return things like [undefined, undefined, undefined]
            if (results[nth] !== undefined) {
              // ...So return only if at least one element is not undefined
              return results;
            }
          }
        };
      }
    });

    if (options.override) {
      Object.assign(List.prototype, options.override);
    }

    return List;
  }

  return makeList(Class, options);
};

exports.default = OneGo;