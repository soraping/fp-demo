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
      ssn: "444444444",
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

const trim = (str: string) => str.replace(/\s/g, "");

const normalize = (str: string) => str.replace(/\-/g, "");

const cleanInput = R.compose(
  normalize,
  trim
);

const validLength = (len: number, str: string) => str.length === len;

const checkLengthSsn = (ssn: string) => {
  return Either.of(ssn).filter(R.partial(validLength, [9]));
  // .getOrElseThrow(`INPUT: ${ssn} is not a valid SSN number`);
};

// QUnit.test("showStudent: cleanInput", assert => {
//   const input = ["", "--44--44--", "444 444", "  4  ", "    4- 4 "];
//   const assertions = ["", "4444", "444444", "4", "44"];
//   assert.expect(input.length);
//   input.forEach((val, key) => {
//     assert.equal(cleanInput(val), assertions[key]);
//   });
// });

// QUnit.test("showStudent: checkLengthSsn", assert => {
//   assert.ok(checkLengthSsn("4443334444").isLeft);
//   assert.ok(checkLengthSsn("").isLeft);
//   assert.ok(checkLengthSsn("4444-444-44").isRight);
//   assert.equal(checkLengthSsn("4444-444-44").chain(R.length), 11);
// });

const safeFindObject = R.curry(function(db, id) {
  return Either.fromNullable(find(db, id));
});

const findStudent = safeFindObject(DB("student"));

/**
 * chain 和 map 交叉使用，来确保 monad 只有一层，用chain来防止嵌套太深
 * @param ssn
 */
const showStudent = (ssn: string) =>
  Either.fromNullable(ssn)
    .map(cleanInput)
    .chain(checkLengthSsn)
    .chain(findStudent)
    .map(R.props(["ssn", "name"]))
    .map(csv)
    .orElse(console.error);

console.log(showStudent("4444-444-44"));

// 组合调用
const monadSsn = ssn => Either.fromNullable(ssn);

const map = R.curry((f, container) => container.map(f));

const chain = R.curry((f, container) => container.chain(f));

const showStudent2 = R.pipe(
  monadSsn,
  map(cleanInput),
  chain(checkLengthSsn),
  chain(findStudent),
  map(R.props(["ssn", "name"])),
  map(csv)
);

console.log(showStudent2("4444-444-44"));
