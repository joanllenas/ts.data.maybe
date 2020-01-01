# Maybe

[![Build Status](https://travis-ci.org/joanllenas/ts.data.maybe.svg?branch=master)](https://travis-ci.org/joanllenas/ts.data.maybe)
[![npm version](https://badge.fury.io/js/ts.data.maybe.svg)](https://badge.fury.io/js/ts.data.maybe)

Maybe encapsulates the idea of a value that might not be there.

A Maybe value can either be `Just` some value or `Nothing`.

```ts
type Maybe<T> = Just<T> | Nothing;
```

Where `Nothing` is an instance of `Nothing`, `null` or `undefined`, and `Just` represents any non `Nothing` value.

> If this is new to you, you may want to read the introductory article [Safer code with container types](https://blog.logrocket.com/safer-code-with-container-types-either-and-maybe/) about why and how to use this library.

## Install

```
npm install ts.data.maybe --save
```

## Example 1

```ts
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
};

const getFullName = (name: string, surname: string) => `${name} ${surname}`;
const maybeFullname = map2(getFullName, user.name, user.surname); // Just<string>('John Doe')
console.log(withDefault(maybeFullname, '')); // 'John Doe'
```

## Example 2

```ts
const prices: Maybe<number>[] = [
  just(300),
  nothing(),
  just(500),
  just(150),
  nothing()
];
const sum = (a: number, b: number) => a + b;
const total = prices
  .filter(n => !equals(n, nothing()))
  .reduce((acc, current) => map2(sum, acc, current), just(0));
console.log(withDefault(total, 0)); // 950
```

## Api

_(Inspired by elm-lang)_

### just

`just<T>(value: T): Maybe<T>;`

Wraps a value in an instance of `Just`.

```ts
just(5); // Just(5) (Maybe<number>)
```

### nothing

`nothing<T>(): Maybe<T>;`

Creates an instance of `Nothing`.

```ts
nothing<number>(); // Nothing (Maybe<number>)
```

> It's recommended to parametrize the function, otherwise the resolved type will be `Maybe<unknown>` and type won't flow through `map`, `andThen` and so on.

### isJust

`isJust(value: Maybe<any>): boolean;`

Returns true if a value is an instance of `Just`.

```ts
isJust(nothing()); // false
```

### isNothing

`isNothing(value: Maybe<any>): boolean;`

Returns true if a value is an instance of `Nothing`.

```ts
isNothing(just(5)); // false
isNothing(undefined); // true
isNothing(null); // true
isNothing(nothing()); // true
```

### withDefault

`withDefault<A>(value: Maybe<A>, defaultValue: A): A;`

If `value` is an instance of `Just` it returns its wrapped value, if it's an instance of `Nothing` it returns the `defaultValue`.

```ts
withDefault(just(5), 0); // 5
withDefault(nothing(), 'hola'); // 'hola'
```

### caseOf

`caseOf<A, B>(caseof: {Just: (v: A) => B; Nothing: () => B;}, value: Maybe<A>): B;`

Run different computations depending on whether a `Maybe` is `Just` or `Nothing` and returns the result.

```ts
caseOf(
  {
    Nothing: () => 'Do nothing',
    Just: n => `Launch ${n} missiles`
  },
  just(5)
); // 'Launch 5 missiles'
```

### map

`map<A, B>(f: (a: A) => B, value: Maybe<A>): Maybe<B>;`

Transforms a `Maybe` value with a given function.

```ts
const add1 = (n: number) => n + 1;
map(add1, just(4)); // Just<number>(5)
map(add1, nothing()); // Nothing
```

There are `map2`, `map3`, `map4`, `map5` and `mapN` functions too:

```ts
map2<A, B, C>(
  f: (a: A, b: B) => C,
  a: Maybe<A>, b: Maybe<B>
): Maybe<C>
```

An example with `map2`:

```ts
const safeParseInt = (num: string): Maybe<number> => {
  const n = parseInt(num, 10);
  return isNaN(n) ? nothing() : just(n);
};
const sum = (x: number, y: number) => x + y;
const safeStringSum = (x: string, y: string) =>
  map2(sum, safeParseInt(x), safeParseInt(y));
safeStringSum('1', '2'); // Just<number>(3)
safeStringSum('a', '2'); // Nothing
```

If you need to parametrize the function with more than one argument, use the `map` that matches your parametrization.

> `mapN` only accepts arguments of the same type)

```ts
map3<A, B, C, D>(
  f: (a: A, b: B, c: C) => D,
  a: Maybe<A>, b: Maybe<B>, c: Maybe<C>
): Maybe<D>
```

```ts
map4<A, B, C, D, E>(
  f: (a: A, b: B, c: C, d: D) => E,
  a: Maybe<A>, b: Maybe<B>, c: Maybe<C>, d: Maybe<D>
): Maybe<E>
```

```ts
map5<A, B, C, D, E, F>(
  f: (a: A, b: B, c: C, d: D, e: E) => F,
  a: Maybe<A>, b: Maybe<B>, c: Maybe<C>, d: Maybe<D>, e: Maybe<E>
): Maybe<F>
```

```ts
mapN<A, B>(
  f: (...a: A[]) => B,
  ...a: Maybe<A>[]
): Maybe<B>
```

### andThen

`andThen<A, B>(f: (a: A) => Maybe<B>, v: Maybe<A>): Maybe<B>;`

Chains together many computations that may fail.

```ts
const head = (arr: string[]) => (arr.length > 0 ? just(arr[0]) : nothing());
andThen(head, just(['a', 'b', 'c'])); // Just<string>('a')
andThen(head, just([])); // Nothing
```

### equals

`equals<T>(a: Maybe<T>, b: Maybe<T>): boolean;`

Compares two `Maybe` instances and returns `true` when both are `Nothing` or their wrapped values are strictly equal (===), `false` otherwise.

```ts
equals(just(5), just(5); // true
equals(just(6), just(5); // false
equals(nothing(), just(5); // false
equals(nothing(), nothing(); // true
equals(null, nothing(); // true
equals(undefined, nothing(); // true
```
