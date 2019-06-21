import * as R from "ramda";

const students = ["zhangsan", "lisi", "wanger", "mazi"];
const grades = [80, 100, 90, 99];

const smartestStudent = R.compose(
  R.head,
  R.pluck(0),
  R.reverse,
  R.sortBy(R.prop(1)),
  R.zip
);

const student = smartestStudent(students, grades);

console.log(student);
