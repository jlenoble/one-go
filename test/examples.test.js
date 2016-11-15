import Muter, {muted} from 'muter';
import {expect} from 'chai';
import OneGo, {ogArgs} from '../src/one-go';

describe('Testing README.md examples', function() {

  const muter = Muter(console, 'log');

  it(`Testing Better to understand with an example`, muted(muter, function() {

    class Name {
      constructor(name) {this.name = name;}

      getName() {return this.name;}
      setName(name) {this.name = name;}
      setFullName(firstName, lastName) {this.name = firstName + lastName;}
      print() {console.log(this.name);}
    }

    const List = OneGo(Name);
    const list = new List('Aaa', 'Bbb', 'Ccc');

    expect(list.getName()).to.eql(['Aaa', 'Bbb', 'Ccc']);

    expect(list.print()).to.be.undefined;
    expect(muter.getLogs()).to.equal('Aaa\nBbb\nCcc\n');

    expect(list.setName('Ddd')).to.be.undefined;
    expect(list.getName()).to.eql(['Ddd', 'Ddd', 'Ddd']);

    expect(list.setName(ogArgs('Eee', 'Fff', 'Ggg'))).to.be.undefined;
    expect(list.getName()).to.eql(['Eee', 'Fff', 'Ggg']);

    expect(list.setFullName(ogArgs(
      ['Eee', 'Ee'],
      ['Fff', 'Ff'],
      ['Ggg', 'Gg']
    ))).to.be.undefined;
    expect(list.getName()).to.eql(['EeeEe', 'FffFf', 'GggGg']);

  }));

  it(`Testing Advanced looping`, muted(muter, function() {

    class Float {
      constructor(number) {this.value = number;}
      add(number) {this.value += number;}
      get() {return this.value;}
    }

    const List = OneGo(Float);
    const list = new List(1, 34, Math.PI, 99.9);

    expect(list.add(ogArgs(1, 2, 3, 4))).to.be.undefined;
    expect(list.get()).to.eql([2, 36, Math.PI + 3, 103.9]);

  }));

  it(`Testing Option 'arrayInit'`, muted(muter, function() {

    class Float {
      constructor(number) {this.value = number;}
      add(number) {this.value += number;}
      get() {return this.value;}
    }

    const List1 = OneGo(Float);
    expect(() => new List1(1, 34, Math.PI, 99.9)).not.to.throw();
    expect(() => new List1([1, 34, Math.PI, 99.9])).not.to.throw();

    const List2 = OneGo(Float, {arrayInit: true});
    expect(() => new List2(1, 34, Math.PI, 99.9)).to.throw();
    expect(() => new List2([1, 34, Math.PI, 99.9])).not.to.throw();

  }));

  it(`Testing Option 'override'`, muted(muter, function() {

    class Float {
      constructor(number) {this.value = number;}
      add(number) {this.value += number;}
      get() {return this.value;}
    }

    const List = OneGo(Float, {
      override: {
        get() {
          return this.elements.reduce((el1, el2) => {
            if (el1.value) {
              el1 = el1.value;
            }
            return el1 + el2.value;
          });
        }
      }
    });

    const list = new List(1, 34, 99.9);
    expect(list.get()).to.equal(134.9);

  }));

  it(`Testing Option 'parallel'`, muted(muter, function() {

    class Float {
      constructor(number) {this.value = number;}
      add(number) {this.value += number;}
      get() {return this.value;}
    }

    const List = OneGo(Float, {
      parallel: {
        get() {
          return 'value: ' + this.value;
        }
      }
    });
    const list= new List(1, 34, 99.9);
    expect(list.get()).to.eql(['value: 1', 'value: 34', 'value: 99.9']);

  }));

});
