/**
 * 容器类型，父类
 */
export class Maybe {
  static just(a) {
    return new Just(a);
  }
  static nothing() {
    return new Nothing();
  }
  /**
   * 由一个可为空的类型创建 Maybe
   * 如果值为空，则创建一个 Nothing；
   * 否则将值存储在 Just 子类型中来表示其存在性
   * @param a
   */
  static formNullable(a) {
    return a !== null ? this.just(a) : this.nothing();
  }
  static of(a) {
    return this.just(a);
  }
  get isNothing() {
    return false;
  }
  get isJust() {
    return false;
  }
}

/**
 * Just 子类型用于处理存在的值
 */
export class Just<T> extends Maybe {
  constructor(private _value: T) {
    super();
  }
  get value() {
    return this._value;
  }
  /**
   * 将映射函数应用于 Just ，变换其中的值，并存储回容器中
   * @param f
   */
  map(f) {
    return Maybe.of(f(this._value));
  }
  /**
   * Monad 提供默认的一元操作，用于从中获取其值
   */
  getOrElse() {
    return this.value;
  }
  filter(f) {
    Maybe.formNullable(f(this.value) ? this.value : null);
  }
  get isJust() {
    return true;
  }
  toString() {
    return `Maybe.Just (${this.value})`;
  }
}

/**
 * Nothing 子类型用于为无值的情况提供保护
 */
export class Nothing extends Maybe {
  map(f) {
    return this;
  }
  /**
   * 任何试图从 Nothing 类型中取值的操作会引发表征错误使用 Monad 的异常
   */
  get value() {
    throw new TypeError("Can not extract the value of a Nothing.");
  }
  /**
   * 忽略值，返回 other
   * @param other
   */
  getOrElse(other) {
    return other;
  }
  /**
   * 如果存在的值满足所给的断言，则返回包含值的 Just，否则，返回 Nothing
   */
  filter() {
    return this.value;
  }
  get isNothing() {
    return true;
  }
  toString() {
    return "Maybe.Nothing";
  }
}
