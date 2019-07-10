import * as _ from "lodash";

export class IO {
  constructor(private effect: Function) {
    if (!_.isFunction(effect)) {
      throw "IO Usage: function required";
    }
  }
  static of(a) {
    return new IO(() => a);
  }
  static from(fn) {
    return new IO(fn);
  }
  map(fn) {
    return new IO(() => fn(this.effect()));
  }
  chain(fn) {
    return fn(this.effect());
  }
  run() {
    return this.effect();
  }
}
