import * as R from "ramda";
class Maybe<T> {
  constructor(private _value: T) {}
  static of<P>(x: P): Maybe<P> {
    return new Maybe(x);
  }
  isNothing() {
    return this._value === null || this._value === undefined;
  }
  map<R>(f: (v: T) => R): Maybe<R> {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this._value));
  }
  get value() {
    return this._value;
  }
}

// Maybe { _value: 'ZHANGSAN' }
console.log(Maybe.of("zhangsan").map(s => s.toLocaleUpperCase()));

// Maybe { _value: null }
console.log(Maybe.of(null).map(s => s.toLocaleUpperCase()));

// Maybe { _value: 20 }
console.log(
  Maybe.of({ age: 10 })
    .map<number>(R.prop("age"))
    .map(n => n + 10)
);

// Maybe { _value: null }
// console.log(
//   Maybe.of({ age: 10 })
//     .map(R.prop("name"))
//     .map(s => s.toLocaleUpperCase())
// );

let address = {
  addresses: [
    {
      street: "tiexinqiao"
    },
    {
      street: "tianlongsi"
    }
  ]
};

let safeHead = function(xs: any[]) {
  return Maybe.of(xs[0]);
};

let map = R.curry(function(f, any_functor_at_all: Maybe<any>) {
  return any_functor_at_all.map(f);
});

let streetName = R.compose(
  map(R.prop("street")),
  safeHead,
  R.prop("addresses")
);

// Maybe { _value: 'tiexinqiao' }
console.log(streetName(address));

// Maybe { _value: null }
console.log(streetName({ addresses: [] }));
