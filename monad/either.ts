export class Either<T> {
  constructor(protected _value: T) {}
  get value() {
    return this._value;
  }
  static left(a) {
    return new Left(a);
  }
  static right(a) {
    return new Right(a);
  }
  static fromNullable(val) {
    return val && val != null ? this.right(val) : this.left(val);
  }
  /**
   * 创建一个包含值的 Right 实例
   * @param a
   */
  static of(a) {
    return this.right(a);
  }
  get isRight() {
    return false;
  }
  get isLeft() {
    return false;
  }
}

export class Right<T> extends Either<T> {
  map(f) {
    return Either.of(f(this.value));
  }
  getOrElse(other) {
    return this.value;
  }
  /**
   * 将给定函数应用于 Left 值上，不对 Right 进行任何操作
   */
  orElse() {
    return this;
  }
  /**
   * 将给定函数应用于 Right 值上并返回其结果，不对 Left 进行操作
   * @param f
   */
  chain(f) {
    return f(this.value);
  }
  /**
   * 如果 Left ，通过给定值抛出异常；否则忽略异常并返回 Right 中的合法值
   * @param _ 占位符
   */
  getOrElseThrow(_) {
    return this.value;
  }
  /**
   * 如果为 Right 且给定的断言为真时，返回包含值的 Right 结构；返回空的 Left
   * @param f
   */
  filter(f) {
    return Either.fromNullable(f(this.value) ? this.value : null);
  }
  toString() {
    return `Either.Right(${this.value})`;
  }
  get isRight() {
    return true;
  }
}

class Left extends Either<any> {
  /**
   * noop
   * 通过映射函数对 Right 结构中的值进行变换，对 Left 不进行任何操作
   * @param _ 占位符
   */
  map(_) {
    return this;
  }
  get value() {
    throw new TypeError("Can not extract the value of a Left");
  }
  /**
   * 提取 Right 的值，如果不存在，则返回给定的默认值
   * @param other
   */
  getOrElse(other) {
    return other;
  }
  /**
   * 将给定函数应用于 Left 值，不对 Right 进行任何操作
   * @param f
   */
  orElse(f) {
    return f(this._value);
  }
  /**
   * 将给定函数应用于 Right 值并返回其结果，不对 Left 进行任何操作。
   */
  chain(f) {
    return this;
  }
  /**
   * 如果为 Left ，通过给定值抛出异常，否则忽略异常并返回 Right 中的合法值
   * @param a
   */
  getOrElseThrow(a) {
    throw new Error(a);
  }
  /**
   * 如果为 Right 且给定的断言为真，返回包含值的 Right 结构; 否则返回空的 Left
   * @param f
   */
  filter(f) {
    return this;
  }
  get isLeft() {
    return true;
  }
  toString() {
    return `Either.left(${this.value})`;
  }
}
