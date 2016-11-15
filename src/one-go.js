class OG {

  constructor (args) {

    this.args = args.map(arg => Array.isArray(arg) ? arg : [arg]);

  }

}

export const ogArgs = function (...args) {

  return new OG(args);

};

const OneGo = function (Class) {

  const proto = Class.prototype;
  const List = function (...args) {

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

          results = this.elements.map((element, ith) => element[prop](
            ...argsi[ith]));

        } else {

          results = this.elements.map(element => element[prop](args0,
            ...args));

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

  return List;

};

export default OneGo;
