import * as R from "ramda";

const fetchStudentFromDb = R.curry((db, ssn) => {
  return find(db, ssn);
});

const fetchStudentFromArray = R.curry((arr, ssn) => {
  return arr[ssn];
});

const findStudent = useDb ? fetchStudentFromDb(db) : fetchStudentFromArray(arr);

findStudent("444-333-222");
