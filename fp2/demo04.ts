import * as R from "ramda";

const person = {
  name: "zhangsan",
  age: 20
};

const nLens = R.lensProp("name");

// zhangsan
console.log(R.view(nLens, person));

// 将字母大写
const result = R.over(nLens, R.toUpper, person);

// { name: 'ZHANGSAN', age: 20 }
console.log(result);

const stutent = {
  name: "lisi",
  age: 18,
  school: {
    class: "one",
    row: 2
  }
};

// const schoolLens = R.lens(
//   R.path(["school", "class"]),
//   R.assocPath(["school", "class"])
// );

const schoolLens = R.lensPath(["school", "class"]);

// one
console.log(R.view(schoolLens, stutent));

let stutentResult = R.set(schoolLens, "two", stutent);

// { name: 'lisi', age: 18, school: { class: 'two', row: 2 } }
console.log(stutentResult);

// one
console.log(R.view(schoolLens, stutent));

// two
console.log(R.view(schoolLens, stutentResult));
