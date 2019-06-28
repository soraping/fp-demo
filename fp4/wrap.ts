import * as R from "ramda";

export interface Wrapper<T> {
  fmap(f: Function): Wrapper<T>;
}

interface IWrap {
  <T>(val: T): Wrapper<T>;
}

export class Wrapper<T> {
  constructor(private value: T) {}

  map(f: IWrap) {
    return f(this.value);
  }

  toString() {
    return `Wrapper (${this.value})`;
  }
}

Wrapper.prototype.fmap = function(f: Function) {
  return wrap(f(this.value));
};

function wrapper<T>(val: T): Wrapper<T> {
  return new Wrapper(val);
}

// 容器方法
export const wrap: IWrap = wrapper;
