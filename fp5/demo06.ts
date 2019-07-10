import * as R from "ramda";
import { Maybe, Just } from "./maybe";

interface IAddress {
  country: string;
  city: string;
}

interface IStudent {
  ssn: string;
  name: string;
  address: IAddress;
}

const DB = (property: string) => {
  return [
    {
      name: "zhangsan",
      ssn: "4444-444-44",
      address: {
        country: "China",
        city: "nanjing"
      }
    },
    {
      name: "lisi",
      ssn: "5555-555-55",
      address: {
        country: "Japan",
        city: "dongjing"
      }
    },
    {
      name: "lucy",
      ssn: "7788-999-000"
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

// console.log(safeStudentName.value);

// console.log(safeStudentName.getOrElse("vivi"));

const getCountry = (student: Just<IStudent>) => {
  return student
    .map(R.prop("address"))
    .map(R.prop("country"))
    .getOrElse("USA");
};

const country = R.compose(
  getCountry,
  safeFindStudent
);

console.log(country("7788-999-000"));
