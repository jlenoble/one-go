import Muter, {muted} from 'muter';
import {expect} from 'chai';
import OneGo, {ogArgs} from '../src/one-go';

describe('Testing options', function() {

  const muter = Muter(console, 'log');

  beforeEach(function() {

    this.Class = class Name {
      constructor(name) {this.name = name;}

      getName() {return this.name;}
      setName(name) {this.name = name;}
      setFullName(firstName, lastName) {this.name = firstName + lastName;}
      print() {console.log(this.name);}
    }

  });

  it(`Option 'arrayInit'`, muted(muter, function() {
    const List = OneGo(this.Class, {arrayInit: true});
    expect(() => new List('Aaa', 'Bbb', 'Ccc')).to.throw(TypeError);

    const list = new List(['Aaa', 'Bbb', 'Ccc']);

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

  it(`Option 'override'`, muted(muter, function() {

    const List = OneGo(this.Class, {
      override: {
        print() {
          console.log('overridden');
        }
      }
    });

    const list = new List('Aaa', 'Bbb', 'Ccc');
    expect(list.getName()).to.eql(['Aaa', 'Bbb', 'Ccc']);

    expect(list.print()).to.be.undefined;
    expect(muter.getLogs()).to.equal('overridden\n');

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

  it(`Option 'parallel'`, muted(muter, function() {

    const List = OneGo(this.Class, {
      parallel: {
        setFullName(firstName, lastName) {
          this.name = `First name: ${firstName}\nLast name: ${lastName}`;
        }
      }
    });

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
    expect(list.getName()).to.eql([
      'First name: Eee\nLast name: Ee',
      'First name: Fff\nLast name: Ff',
      'First name: Ggg\nLast name: Gg'
    ]);

  }));

});
