class Either<T> {
  constructor(protected _value: T) {}

  get value() {
    return this._value;
  }
}

class Left<T> extends Either<T> {
  static of<P>(x: P): Left<P> {
    return new Left(x);
  }
  map<R>(f: (v: T) => R) {
    return this;
  }
  get value() {
    return null;
  }
}

class Right<T> extends Either<T> {
  static of<P>(x: P): Right<P> {
    return new Right(x);
  }
  map<R>(f: (v: T) => R): Right<R> {
    return Right.of(f(this._value));
  }
}
