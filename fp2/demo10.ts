import * as _ from "lodash";
let students = [
  {
    name: "zhangsan",
    score: 20
  },
  {
    name: "lisi",
    score: 12
  },
  {
    name: "wanger",
    score: 30
  }
];

const getScore = student => student.score;

const getTotal = (prev, score) => prev + score;

let total = _(students)
  .map(getScore)
  .reduce(getTotal, 0);

console.log(total);
