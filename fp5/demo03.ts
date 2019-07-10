import * as R from "ramda";
import { wrap, Wrapper } from "./wrap";

interface IHalf {
  <T>(val: number): Wrapper<T>;
}

// 无操作，其代表着 空 或者 无 的概念，类似 wrapper 的容器。
const Empty = function() {};

// 将 map 到 Empty 上会跳过该操作
Empty.prototype.map = function() {
  return this;
};

const empty = () => new Empty();

// 检测是否数值类型且区分奇偶
const isEven = (n: number) => Number.isFinite(n) && n % 2 == 0;

// 只操作偶数，奇数则返回 empty
const half: IHalf = val => (isEven(val) ? wrap(val / 2) : empty());

// Wrapper { value: 2 }
console.log(half(4));

// Empty {}
console.log(half(5));

const plus = R.curry((a, b) => a + b);

const plus3 = plus(3);

// Empty {}
console.log(half(5).fmap(plus3));
