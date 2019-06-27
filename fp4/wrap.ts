import * as R from "ramda";

interface Wrapper {
  fmap(f: Function): Wrapper;
}

class Wrapper {
  constructor(private value: any) {}

  map(f: Function) {
    return f(this.value);
  }

  toString() {
    return `Wrapper (${this.value})`;
  }
}

Wrapper.prototype.fmap = function(f: Function) {
  return wrap(f(this.value));
};

// 容器方法
export const wrap = (val: any) => new Wrapper(val);
