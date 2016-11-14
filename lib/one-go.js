'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OG = function OG(args) {
  _classCallCheck(this, OG);

  this.args = args;
};

var ogArgs = exports.ogArgs = function ogArgs(args) {

  return new OG(args);
};

var OneGo = function OneGo(Class) {

  var proto = Class.prototype;
  var List = function List(args) {

    this.elements = args.map(function (arg) {

      if (arg instanceof Class) {

        return arg;
      }

      return new (Function.prototype.bind.apply(Class, [null].concat(_toConsumableArray(arg))))();
    });
  };

  Object.getOwnPropertyNames(proto).forEach(function (prop) {

    if (typeof proto[prop] === 'function' && prop !== 'constructor') {

      List.prototype[prop] = function (args0) {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        if (args0 instanceof OG) {
          var _ret = function () {

            var argsi = args0.args;

            if (argsi.length !== _this.elements.length) {

              throw new Error('Number of elements in list and number of args don\'t match');
            }

            return {
              v: _this.elements.map(function (element, ith) {
                return element[prop].apply(element, _toConsumableArray(argsi[ith]));
              })
            };
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }

        return this.elements.map(function (element) {
          return element[prop].apply(element, [args0].concat(args));
        });
      };
    }
  });

  return List;
};

exports.default = OneGo;