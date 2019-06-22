import * as R from "ramda";

const runProgram = R.pipe(
  R.map(R.toLower),
  R.uniq,
  R.sortBy(R.identity)
);

const programList = [
  "PHP",
  "JAVA",
  "PYTHON",
  "GO",
  "PHP",
  "ASP",
  "JAVASCRIPT",
  "GO"
];

console.log(runProgram(programList));
