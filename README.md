# one-go
Deal with a set of objects in one go!

## Goal

The module is implemented as a way of prototyping faster by abstracting away looping over collections. But this is done at the expence of execution speed, as objects are looped over again and again.

OneGo is a factory that given a class Class returns a function List whose prototype shares the same API as Class and does the same object by object in the collection.

## Usage

### Better to understand with an example:

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
const list = new List('Aaa', 'Bbb', 'Ccc');

list.getName(); // Returns ['Aaa', 'Bbb', 'Ccc']
list.print(); // Prints 'Aaa\nBbb\nCcc\n'
list.setName('Ddd'); // Sets every name to 'Ddd'
list.setName(ogArgs('Eee', 'Fff', 'Ggg')); // Sets names respectively to 'Eee', 'Fff', 'Ggg'
list.setFullName(ogArgs(
  ['Eee', 'Ee'],
  ['Fff', 'Ff'],
  ['Ggg', 'Gg']
)); // Sets names respectively to 'EeeEe', 'FffFf', 'GggGg'
```

### Creating a List constructor: ```const List = OneGo(Class)```

List and Class have the same API. Each method of List wraps a loop over the same method in Class. Their results (if any) are returned as an array of all results.

### Instantiating a list: ```const list = new List(...args)```

Arguments passed to the constructor can be as many as necessary. Their initial number determines once and for all the size of each generated loops.

If the original class constructor takes a single argument, then ```[]``` can be omitted around it when passed to the List constructor. But if the original class takes more arguments, then ```[]``` are necessary to distinguish which object should be initialized with what.

Some valid constructions:

```js
const list1 = new List('Aaa', 'Bbb', 'Ccc');
const list2 = new List(['Aaa'], ['Bbb'], ['Ccc']);
const list3 = new List(
  ['Aaa', 1, {id: 'id1'}],
  ['Bbb', 21, {id: 'id2'}],
  ['Ccc', 12, {id: 'id3'}]
);
```

### Simple looping: ```list.methodName(...args)```

By default, a call to a method with some arguments passes those arguments to each and every wrapped object associated method.

If you have a method adding an argument to a property, then that argument will be added to each and every same property of the underlying objects.

If you desire a more vector like behavior, for a one-to-one addition for example, you need a special construct with ```ogArgs``` function as a helper. See below.

### Advanced looping: ```list.methodName(ogArgs(...args))```

When you want to pass distinct arguments to every underlying object methods, you need to use the wrapping function ```ogArgs```. It will take care of distributing your arguments to their respective targets.

```js
import OneGo, {ogArgs} from 'one-go';

class Float {
  constructor(number) {this.value = number;}
  add(number) {this.value += number;}
  get() {return this.value;}
}

const List = OneGo(Float);
const list = new List(1, 34, Math.PI, 99.9);

list.add(ogArgs(1, 2, 3, 4);
list.get(); // Returns [2, 36, 6.1415926..., 103.9]
```

## License

one-go is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
