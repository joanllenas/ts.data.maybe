# Maybe

[![Build Status](https://travis-ci.org/joanllenas/ts.data.maybe.svg?branch=master)](https://travis-ci.org/joanllenas/ts.data.maybe)
[![npm version](https://badge.fury.io/js/ts.data.maybe.svg)](https://badge.fury.io/js/ts.data.maybe)

Maybe encapsulates the idea of a value that might not be there.

A Maybe value can either be `Just` some value or `Nothing`.

````ts
type Maybe<T> =
  | Just<T>
  | Nothing
````


Where `Nothing` is an instance of `Nothing`, `null` or `undefined`, and `Just` represents any non `Nothing` value.

## Install

````
npm install ts.data.maybe --save
````

## Example

````ts
import { Maybe, just, withDefault, map2 } from 'ts.data.maybe';

interface User {
  email: string;
  name: Maybe<string>;
  surname: Maybe<string>;
}
const user: User = {
  email: 'user@example.com',
  name: just('John'),
  surname: just('Doe')
}

const getFullName = (name: string, surname: string) => `${name} ${surname}`;
const maybeFullname = map2(getFullName, user.name, user.surname); // Just<string>('John Doe')
const fullName = withDefault(maybeFullname, ''); // 'John Doe'
````

## Api

_(Inspired by elm-lang)_

### just
`just<T>(value: T): Just<T>`

Wraps a value in an instance of `Just`.

````ts
just(5); // Just<number>(5)
````

### nothing
`nothing(): Nothing`

Creates an instance of `Nothing`.

````ts
nothing(); // Nothing
````

### isJust
`isJust(value: Maybe<any>): boolean`

Returns true if a value is an instance of `Just`.

````ts
isJust(nothing()); // false
````
### isNothing
`isNothing(value: Maybe<any>): boolean`

Returns true if a value is an instance of `Nothing`.

````ts
isNothing(just(5)); // false
isNothing(undefined) // true
isNothing(null) // true
isNothing(nothing()) // true
````

### withDefault
`withDefault<A>(value: Maybe<A>, defaultValue: A): A`

If `value` is an instance of `Just` it returns its wrapped value, if it's an instance of `Nothing` it returns the `defaultValue`.

````ts
withDefault(just(5), 0); // 5
withDefault(nothing(), 'hola'); // 'hola'
````

### caseOf
`caseOf = <A, B>(caseof: {
  Just: (v: A) => B;
  Nothing: () => B;
}, value: Maybe<A>): B`

Run different computations depending on whether a `Maybe` is `Just` or `Nothing`.

````ts
caseOf({
  Nothing: () => 'zzz',
  Just: n => `Launch ${n} missiles`
}, just(5)); // 'Launch 5 missiles'
````

### map
`map<A, B>(f: (a: A) => B, value: Maybe<A>): Maybe<B>`

Transforms a `Maybe` value with a given function.

````ts
const add1 = (n: number) => n + 1;
map(add1, just(4)); // Just<number>(5)
map(add1, nothing()); // Nothing
````

There are `map2`, `map3`, `map4`, `map5` and `mapN` if you need to parametrize the function with more than one argument. (`mapN` only accepts arguments of the same type).

````ts
map2<A, B, C>(
  f: (a: A, b: B) => C, 
  a: Maybe<A>, b: Maybe<B>
): Maybe<C>
````

````ts
map3<A, B, C, D>(
  f: (a: A, b: B, c: C) => D, 
  a: Maybe<A>, b: Maybe<B>, c: Maybe<C>
): Maybe<D>
````

````ts
map4<A, B, C, D, E>(
  f: (a: A, b: B, c: C, d: D) => E, 
  a: Maybe<A>, b: Maybe<B>, c: Maybe<C>, d: Maybe<D>
): Maybe<E>
````

````ts
map5<A, B, C, D, E, F>(
  f: (a: A, b: B, c: C, d: D, e: E) => F, 
  a: Maybe<A>, b: Maybe<B>, c: Maybe<C>, d: Maybe<D>, e: Maybe<E>
): Maybe<F>
````

````ts
mapN<A, B>(
  f: (...a: A[]) => B, 
  ...a: Maybe<A>[]
): Maybe<B>
````

### andThen
`andThen = <A, B>(f: (a: A) => Maybe<B>, v: Maybe<A>): Maybe<B>`

Chains together many computations that may fail.

````ts
const head = (arr: string[]) => arr.length > 0 ? just(arr[0]) : nothing();
andThen(head, just(['a','b','c'])); // Just<string>('a')
andThen(head, just([])); // Nothing
````
