// const Container = function(x) {
//   this._value = x;
// };

// Container.of = function(x) {
//   return new Container(x);
// };

import * as R from "ramda";

class Container<T> {
  constructor(private _value: T) {}
  static of<P>(x: P) {
    return new Container<P>(x);
  }
  map<P>(f: (v: T) => P): Container<P> {
    return Container.of(f(this._value));
  }
}

// Container { _value: { name: 'zhangsan' } }
console.log(Container.of({ name: "zhangsan" }));

// Container { _value: 'zhangsan' }
console.log(Container.of("zhangsan"));

// Container { _value: 'ZHANGSAN' }
console.log(
  Container.of<string>("zhangsan").map<string>(s => s.toLocaleUpperCase())
);

// Container { _value: 'ZHANGSAN' }
console.log(
  Container.of({ name: "zhangsan" })
    .map(R.prop("name"))
    .map(s => s.toLocaleUpperCase())
);
