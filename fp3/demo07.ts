import * as R from "ramda";

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

const findObject = R.curry((db, id) => {
  const obj = find(db, id);
  if (obj === null) {
    throw new Error(`Object with id ${id} not found!`);
  }
  return obj;
});

const findStudent = findObject(DB("student"));

const csv = (student: IStudent) => `${student.ssn} - ${student.name}`;

const append = R.curry((elementId, info) => {
  document.querySelector(elementId).innerHtml = info;
  return info;
});

const trim = (str: string) => str.replace(/(^\s*)|(\s*$)/g, "");

const normalize = (str: string) => str.replace(/\-/g, "");

const showStudent = R.compose(
  append("#student-info"),
  csv,
  findStudent,
  trim
);

console.log(showStudent(" 4444-444-44 "));
