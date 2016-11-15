class OG {
  constructor (args) {
    this.args = args.map(arg => Array.isArray(arg) ? arg : [arg]);
  }
}

export const ogArgs = function (...args) {
  return new OG(args);
};

const OneGo = function (Class, options = {}) {

  function makeList (Class, options) {
    let List;

    if (options.arrayInit) {
      List = function (args) {
        this.elements = args.map(arg => {
          if (arg instanceof Class) {
            return arg;
          }

          if (Array.isArray(arg)) {
            return new Class(...arg);
          }

          return new Class(arg);
        });
      };
    } else {
      List = function (...args) {
        this.elements = args.map(arg => {
          if (arg instanceof Class) {
            return arg;
          }

          if (Array.isArray(arg)) {
            return new Class(...arg);
          }

          return new Class(arg);
        });
      };
    }

    let proto = {};

    Object.getOwnPropertyNames(Class.prototype).forEach(prop => {
      proto[prop] = Class.prototype[prop];
    });

    if (options.parallel) {
      Object.assign(proto, options.parallel);
    }

    Object.getOwnPropertyNames(proto).forEach(prop => {
      if (typeof proto[prop] === 'function' && prop !== 'constructor') {
        List.prototype[prop] = function (args0, ...args) {
          let results;

          if (args0 instanceof OG) {
            const argsi = args0.args;

            if (argsi.length !== this.elements.length) {
              throw new Error(
                `Number of elements in list and number of args don't match`);
            }

            results = this.elements.map((element, ith) => proto[prop].apply(
              element, argsi[ith]));
          } else {
            results = this.elements.map(element => proto[prop].apply(
              element, [args0, ...args]));
          }

          for (let nth = 0, len = results.length; nth < len; nth++) {
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

export default OneGo;
