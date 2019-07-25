import * as _ from "lodash";

function sum(arr) {
  if (_.isEmpty(arr)) {
    return 0;
  }
  return _.first(arr) + sum(_.drop(arr));
}

function sumTCO(arr: number[], acc = 0) {
  if (_.isEmpty(arr)) {
    return acc;
  }
  return sumTCO(_.drop(arr), acc + _.first(arr));
}

let arr = [1, 2, 3, 4, 5, 6, 7];

console.time("sum");
console.log(sum(arr));
console.timeEnd("sum");

console.time("sumTCO");
console.log(sumTCO(arr));
console.timeEnd("sumTCO");
