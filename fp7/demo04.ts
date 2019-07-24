import * as R from "ramda";
import { IO } from "../monad";
import "../helper/memoize";
import { performance } from "perf_hooks";

const add = (a, b) => {
  let sum = a + b;
  for (let i = 0; i < 100; i++) {
    sum += i;
  }
  return sum;
};

const addMemoize = add.memoize();

const start = () => performance.now();

const end = startTime => {
  let endTime = performance.now();
  return (endTime - startTime).toFixed(3);
};

const test = (fn, ...args) => () => fn(...args);

const testAdd = IO.of(start())
  .map(R.tap(test(addMemoize, 1, 2)))
  .map(end);

console.log(testAdd.run());
console.log(testAdd.run());
console.log(testAdd.run());
