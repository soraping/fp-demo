import * as R from "ramda";
import "../helper/memoize";

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

const safeFindObject = R.curry(find);

const findStudent = safeFindObject(DB("student")).memoize();

findStudent("4444-444-44");
findStudent("4444-444-44");
findStudent("4444-444-44");
