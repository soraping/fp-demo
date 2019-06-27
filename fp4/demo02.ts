import * as R from "ramda";
import { wrap } from "./wrap";

interface IStudent {
  ssn: string;
  name: string;
}

const sayX = (x: any) => console.log("student is =>", x);

const DB = (property: string) => {
  return [
    {
      name: "zhangsan",
      ssn: "4444-444-44"
    },
    {
      name: "lisi",
      ssn: "5555-555-55"
    }
  ];
};

const find = (db: IStudent[], id: string) => {
  return R.find(R.propEq("ssn", id))(db);
};

// 包裹对象获取逻辑，以避免找不到对象所造成的问题
const findStudent = R.curry((db, ssn) => wrap(find(db, ssn)));

// 获取容器中的值
// console.log(findStudent(DB("student"))("4444-444-44").map(R.identity));

const getName = function(student: IStudent) {
  return wrap;
};

const student = R.compose(
  R.tap(sayX),
  findStudent(DB("student"))
);

console.log(student("4444-444-44"));
