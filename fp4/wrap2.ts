interface IMapFunc {
  <T>(val: T): T;
}

export class Wrapper<T> {
  constructor(private value: T) {}
  // unit 函数
  static of<P>(value: P) {
    return new Wrapper(value);
  }
  // bind 函数
  map(f: IMapFunc) {
    return Wrapper.of(f(this.value));
  }
  // 压平嵌套 wrapper
  join() {
    if (!(this.value instanceof Wrapper)) {
      return this;
    }
    return this.value.join();
  }
  toString() {
    return `Wrapper [${this.value}]`;
  }
}
