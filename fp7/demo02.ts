import * as _ from "lodash";
import * as R from "ramda";

const square = x => Math.pow(x, 2);

const isEven = x => x % 2 === 0;

// // 生成一个从0到200数值数组
const numbers = _.range(200);

const log = name => R.tap(() => console.log(`[${name}]`));

const squareR = R.compose(
  log("mapping"),
  square
);

const isEvenR: (p: any) => boolean = R.compose(
  log("then filter"),
  isEven
);

// const result = R.compose(
//   R.take(3),
//   R.filter(isEvenR),
//   R.map(squareR)
// );

// console.log(result(numbers));

const result = _.chain(numbers)
  .map(squareR)
  .filter(isEvenR)
  .take(3)
  .value();

console.log(result);
