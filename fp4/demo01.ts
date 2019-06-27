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

// 容器方法
const wrap = (val: any) => new Wrapper(val);

// 容器化
const wrappedValue = wrap("Get Functional");

// 读取容器内的内容
console.log(wrappedValue.map(R.identity));

// 改变容器内的内容
console.log(wrappedValue.map(R.toUpper));

Wrapper.prototype.fmap = function(f: Function) {
  return wrap(f(this.value));
};

const plus = R.curry((a, b) => a + b);

const plus3 = plus(3);

// 将2放入容器中
const twoWrapper = wrap(2);

// 调用 fmap 把 plus3 映射到新容器上
const fiveWrapper = twoWrapper.fmap(plus3);

console.log(fiveWrapper.map(R.identity));
