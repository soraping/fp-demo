import * as R from "ramda";
import { Either } from "./either";

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

const csv = arr => arr.join(",");

const validLength = (len: number, str: string) => str.length === len;

const checkLengthSsn = (ssn: string) => {
  return Either.of(ssn)
    .filter(R.partial(validLength, [11]))
    .getOrElseThrow(`INPUT: ${ssn} is not a valid SSN number`);
};

const safeFindObject = R.curry(function(db, id) {
  return Either.fromNullable(find(db, id)).getOrElseThrow(
    `Object not found with id ${id}`
  );
});

const findStudent = safeFindObject(DB("student"));

// 链式调用
const showStudent = (ssn: string) =>
  Either.fromNullable(ssn)
    .map(checkLengthSsn)
    .map(findStudent)
    .map(R.props(["ssn", "name"]))
    .chain(csv);

console.log(showStudent("4444-444-44"));

// 组合调用
const monadSsn = ssn => Either.fromNullable(ssn);

const map = R.curry((f, container) => container.map(f));

const chain = R.curry((f, container) => container.chain(f));

const showStudent2 = R.pipe(
  monadSsn,
  map(checkLengthSsn),
  map(findStudent),
  map(R.props(["ssn", "name"])),
  chain(csv)
);

console.log(showStudent2("4444-444-44"));
