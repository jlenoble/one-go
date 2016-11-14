class OG {

  constructor (args) {

    this.args = args;

  }

}

export const ogArgs = function (args) {

  return new OG(args);

};

const OneGo = function (Class) {

  const proto = Class.prototype;
  const List = function (args) {

    this.elements = args.map(arg => {

      if (arg instanceof Class) {

        return arg;

      }

      return new Class(...arg);

    });

  };

  Object.getOwnPropertyNames(proto).forEach(prop => {

    if (typeof proto[prop] === 'function' && prop !== 'constructor') {

      List.prototype[prop] = function (args0, ...args) {

        if (args0 instanceof OG) {

          const argsi = args0.args;

          if (argsi.length !== this.elements.length) {

            throw new Error(
              `Number of elements in list and number of args don't match`);

          }

          return this.elements.map((element, ith) => element[prop](
            ...argsi[ith]));

        }

        return this.elements.map(element => element[prop](args0, ...args));

      };

    }

  });

  return List;

};

export default OneGo;
