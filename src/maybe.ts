export class Just<T> {
  private _tag = 'Just';
  constructor(readonly _value: T) { }
}
export class Nothing {
  private _tag = 'Nothing';
}

export type Maybe<T> = Just<T> | Nothing;

export const just = <T>(value: T): Just<T> => {
  return new Just(value);
}

export const nothing = (): Nothing => {
  return new Nothing();
}

export const isJust = (value: Maybe<any>) => {
  return value instanceof Just;
}

export const isNothing = (value: Maybe<any>) => {
  return value instanceof Nothing || value === null || value === undefined;
}

export const withDefault = <A>(value: Maybe<A>, defaultValue: A): A => {
  switch (isNothing(value)) {
      case false:
          return (value as Just<A>)._value; 
      case true:
          return defaultValue;
  } 
}

export const map = <A, B>(f: (a: A) => B, value: Maybe<A>): Maybe<B> => {
  switch (isNothing(value)) {
      case false:
          return just(f((value as Just<A>)._value)); 
      case true:
          return nothing();
  } 
}

export const map2 = <A, B, C>(f: (a: A, b: B) => C, a: Maybe<A>, b: Maybe<B>): Maybe<C> => {
  switch(isNothing(a) || isNothing(b)) {
    case true:
      return nothing();
    case false:
      return just(f((a as Just<A>)._value, (b as Just<B>)._value));
  }
};

export const map3 = <A, B, C, D>(f: (a: A, b: B, c: C) => D, a: Maybe<A>, b: Maybe<B>, c: Maybe<C>): Maybe<D> => {
  switch(isNothing(a) || isNothing(b) || isNothing(c)) {
    case true:
      return nothing();
    case false:
      return just(f((a as Just<A>)._value, (b as Just<B>)._value, (c as Just<C>)._value));
  }
};

export const map4 = <A, B, C, D, E>(f: (a: A, b: B, c: C, d: D) => E, a: Maybe<A>, b: Maybe<B>, c: Maybe<C>, d: Maybe<D>): Maybe<E> => {
  switch(isNothing(a) || isNothing(b) || isNothing(c) || isNothing(d)) {
    case true:
      return nothing();
    case false:
      return just(f((a as Just<A>)._value, (b as Just<B>)._value, (c as Just<C>)._value, (d as Just<D>)._value));
  }
};

export const map5 = <A, B, C, D, E, F>(f: (a: A, b: B, c: C, d: D, e: E) => F, a: Maybe<A>, b: Maybe<B>, c: Maybe<C>, d: Maybe<D>, e: Maybe<E>): Maybe<F> => {
  switch(isNothing(a) || isNothing(b) || isNothing(c) || isNothing(d) || isNothing(e)) {
    case true:
      return nothing();
    case false:
      return just(f((a as Just<A>)._value, (b as Just<B>)._value, (c as Just<C>)._value, (d as Just<D>)._value, (e as Just<E>)._value));
  }
};

export const mapN = <A, B>(f: (...a: A[]) => B, ...a: Maybe<A>[]): Maybe<B> => {
  switch(a.some(isNothing)) {
    case true:
      return nothing();
    case false:
      return just(f(...(a as Just<A>[]).map(v => v._value)));
  }
};

export const andThen = <A, B>(f: (a: A) => Maybe<B>, v: Maybe<A>): Maybe<B> => {
  switch(isNothing(v)) {
    case true:
      return nothing();
    case false:
      return f((v as Just<A>)._value);
  }
};

export const caseOf = <A, B>(caseof: {
  Just: (v: A) => B;
  Nothing: () => B;
}, value: Maybe<A>): B => {
  switch(isNothing(value)) {
    case true:
      return caseof.Nothing();
    case false:
      return caseof.Just((value as Just<A>)._value);
  }
};
