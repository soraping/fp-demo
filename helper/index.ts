import * as R from "ramda";
import { Either } from "../monad/either";

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

const salfFindObject = R.curry(function(db, id) {
  return Either.fromNullable(find(db, id));
});

export const findStudent = salfFindObject(DB("student"));
