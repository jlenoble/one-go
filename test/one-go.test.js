import Muter, {muted} from 'muter';
import {expect} from 'chai';
import OneGo, {ogArgs} from '../src/one-go';

describe('Testing OneGo', function() {

  const muter = Muter(console, 'log');

  describe(`Testing with simple class 'Name'`, function() {

    before(function () {

      this.Class = class Name {

        constructor(name) {this.name = name;}

        getName() {return this.name;}
        setName(name) {this.name = name;}
        print() {console.log(this.name);}

      };

    });

    beforeEach(function () {

      this.List = OneGo(this.Class);
      this.list = new this.List([
        ['Aaa'],
        ['Bbb'],
        ['Ccc']
      ]);

    });

    it(`Testing list.getName()`, muted(muter, function() {

      expect(this.list.getName()).to.eql(['Aaa', 'Bbb', 'Ccc']);

    }));

    it(`Testing list.print()`, muted(muter, function() {

      this.list.print();
      expect(muter.getLogs()).to.equal('Aaa\nBbb\nCcc\n');

    }));

    it(`Testing list.setName(name)`, muted(muter, function() {

      this.list.setName('Ddd');
      expect(this.list.getName()).to.eql(['Ddd', 'Ddd', 'Ddd']);

      this.list.print();
      expect(muter.getLogs()).to.equal('Ddd\nDdd\nDdd\n');

    }));

    it(`Testing list.setName(ogArgs(names))`, muted(muter, function() {

      this.list.setName(ogArgs([
        ['Eee'],
        ['Fff'],
        ['Ggg']
      ]));
      expect(this.list.getName()).to.eql(['Eee', 'Fff', 'Ggg']);

      this.list.print();
      expect(muter.getLogs()).to.equal('Eee\nFff\nGgg\n');

    }));

    it(`Testing list.setName(ogArgs(too few names))`,
    muted(muter, function() {

      expect(() => this.list.setName(ogArgs([
        ['Eee'],
        ['Fff']
      ]))).to.throw(Error,
        `Number of elements in list and number of args don't match`);

    }));

    it(`Testing list.setName(ogArgs(too many names))`,
    muted(muter, function() {

      expect(() => this.list.setName(ogArgs([
        ['Eee'],
        ['Fff'],
        ['Ggg'],
        ['Hhh']
      ]))).to.throw(Error,
        `Number of elements in list and number of args don't match`);

    }));

  });

});
