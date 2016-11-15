# one-go
Deal with a set of objects in one go!

## Goal

The module is implemented as a way of prototyping faster by abstracting away looping over collections. But this is done at the expence of execution speed, as objects are looped over again and again.

OneGo is a factory that given a class Class returns a function List whose prototype shares the same API as Class and does the same object by object in the collection.

## Usage

Better to understand with an example:

```js
import OneGo, {ogArgs} from 'one-go';

class Name {
  constructor(name) {this.name = name;}

  getName() {return this.name;}
  setName(name) {this.name = name;}
  setFullName(firstName, lastName) {this.name = firstName + lastName;}
  print() {console.log(this.name);}
}

const List = OneGo(Name);
const list = new List([
  ['Aaa'],
  ['Bbb'],
  ['Ccc']
]);

list.getName(); // Returns ['Aaa', 'Bbb', 'Ccc']
list.print(); // Prints 'Aaa\nBbb\nCcc\n'
list.setName('Ddd'); // Sets every name to 'Ddd'
list.setName(ogArgs([
  ['Eee'],
  ['Fff'],
  ['Ggg']
])); // Sets names respectively to 'Eee', 'Fff', 'Ggg'
list.setFullName(ogArgs([
  ['Eee', 'Ee'],
  ['Fff', 'Ff'],
  ['Ggg', 'Gg']
])); // Sets names respectively to 'EeeEe', 'FffFf', 'GggGg'
```

## License

one-go is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
