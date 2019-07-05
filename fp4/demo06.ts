import * as R from "ramda";
import { Maybe } from "./maybe";

interface IStudent {
  ssn: string;
  name: string;
}

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

const safeFindObject = R.curry(function(db, id) {
  return Maybe.formNullable(find(db, id));
});

const safeFindStudent = safeFindObject(DB("student"));

const safeStudentName = safeFindStudent("4444-444-44").map(R.prop("name"));

console.log(safeStudentName);
