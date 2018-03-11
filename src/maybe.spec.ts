import { Maybe, isJust, nothing, just, isNothing, withDefault, map, map2, map3, map4, map5, mapN, andThen } from './maybe';

import * as mocha from 'mocha';
import * as chai from 'chai';
import { caseOf } from '.';

const expect = chai.expect;

describe('Maybe', () => {
  describe('isJust', () => {
    it('should return false when Nothing is provided', () => {
      expect(isJust(nothing())).to.be.false;
    });
    it('should return true when Just is provided', () => {
      expect(isJust(just('hola'))).to.be.true;
    });
    it('should return false when null is provided', () => {
      expect(isJust(null)).to.be.false;
    });
    it('should return false when undefined is provided', () => {
      expect(isJust(undefined)).to.be.false;
    });
  });

  describe('isNothing', () => {
    it('should return false when Just is provided', () => {
      expect(isNothing(just('hola'))).to.be.false;
    });
    it('should return true when Nothing is provided', () => {
      expect(isNothing(nothing())).to.be.true;
    });
    it('should return true when null is provided', () => {
      expect(isNothing(null)).to.be.true;
    });
    it('should return true when undefined is provided', () => {
      expect(isNothing(undefined)).to.be.true;
    });
  });

  describe('withDefault', () => {
    it('should return the Just value when Just is provided', () => {
      expect(withDefault(just(6), 0)).to.equal(6);
    });
    it('should return the default value when Nothing is provided', () => {
      expect(withDefault(nothing(), 0)).to.equal(0);
    });
    it('should return the default value when null is provided', () => {
      expect(withDefault(null, 1)).to.equal(1);
    });
    it('should return the default value when undefined is provided', () => {
      expect(withDefault(undefined, 2)).to.equal(2);
    });
  });

  describe('map', () => {
    const add1 = (n: number) => n + 1;
    it('should return Just when mapping over Just', () => {
      const maybeFour = just(4);
      const maybeFive = map(add1, maybeFour);
      expect(isJust(maybeFive)).to.be.true;
    });
    it('should return Nothing when mapping over Nothing', () => {
      const result = map(add1, nothing());
      expect(isNothing(result)).to.be.true;
    });
    it('should be isNothing === true when mapping over null', () => {
      const result = map(add1, null);
      expect(isNothing(result)).to.be.true;
    });
    it('should be isNothing === true when mapping over undefined', () => {
      const result = map(add1, undefined);
      expect(isNothing(result)).to.be.true;
    });
    it('should return 5 when adding 1 to Just(5)', () => {
      const maybeFour = just(4);
      const maybeFive = map(add1, maybeFour);
      expect(withDefault(maybeFive, 0)).to.equal(5);
    });
  });
  
  describe('map2', () => {
    const fullname = (a: string, b: string) => a + ' ' + b;
    it('should return the fullname when appending Just("name") to Just("surname")', () => {
      const maybeName = just('John');
      const maybeSurame = just('Doe');
      const maybeFullname = map2(fullname, maybeName, maybeSurame);
      expect(withDefault(maybeFullname, '-')).to.equal('John Doe');
    });
    it('should return Nothing when appending Just() with Nothing', () => {
      const maybeName = just('John');
      const maybeFullname = map2(fullname, maybeName, nothing());
      expect(isNothing(maybeFullname)).to.be.true;
    });
  });
  
  [map3, map4, map5].forEach((f: Function, index) => {
    const n = index+3;
    describe(`map${n}`, () => {
      const gt = (...nums: number[]) => nums.every(num => num > 3);
      const just4Array = (len) => Array.apply(null, Array(len)).map(_ => just(4));
      it('should return the true when all are greater than 3', () => {
        const result = f(gt, ...just4Array(n));
        expect(withDefault(result, false)).to.be.true;
      });
      it('should be Nothing when any is Nothing', () => {
        const arr: Maybe<number>[] = just4Array(n);
        arr[2] = nothing();
        const result = f(gt, ...arr);
        expect(isNothing(result)).to.be.true;
      });
    });
  });

  describe('mapN', () => {
    const fullname = (a: string, b: string, c: string) => a + ' ' + b + ' ' + c;
    it('should return the fullname when appending Just("name") to Just("middle") to Just("surname")', () => {
      const maybeName = just('John');
      const maybeMiddleName = just('D');
      const maybeSurame = just('Doe');
      const maybeFullname = mapN(fullname, maybeName, maybeMiddleName, maybeSurame);
      expect(withDefault(maybeFullname, '-')).to.equal('John D Doe');
    });
    it('should return Nothing when appending Just() with Nothing', () => {
      const maybeName = just('John');
      const maybeSurame = just('Doe');
      const maybeFullname = mapN(fullname, maybeName, nothing(), maybeSurame);
      expect(isNothing(maybeFullname)).to.be.true;
    });
  });
  
  describe('andThen', () => {
    const head = (arr: string[]) => arr.length > 0 ? just(arr[0]) : nothing();
    it('should return Just(computation result) when Just is provided as argument', () => {
      const result = andThen(head, just(['a','b','c']));
      expect(withDefault(result, '')).to.equal('a');
    });
    it('should return Nothing when Nothing is provided as argument', () => {
      const result = andThen(head, nothing());
      expect(withDefault(result, '')).to.equal('');
    });
  });
  
  describe('caseOf', () => {
    it('should Launch 5 missiles', () => {
      const result = caseOf({
        Nothing: () => 'zzz',
        Just: n => `Launch ${n} missiles`
      }, just('5'));
      expect(result).to.equal('Launch 5 missiles');
    });
    it('should zzz', () => {
      const result = caseOf({
        Nothing: () => 'zzz',
        Just: n => `Launch ${n} missiles`
      }, nothing());
      expect(result).to.equal('zzz');
    });
  });
});