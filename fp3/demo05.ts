import * as R from "ramda";
import * as _ from "lodash";

const trim = (str: string) => str.replace(/^\s*$/g, "");

const normalize = (str: string) => str.replace(/\-/g, "");

const cleanInput = R.compose(
  normalize,
  trim
);

const validLength = (len: number, str: string) => str.length === len;

const checkLength = _.partial(validLength, 9);

const isValid = R.compose(
  checkLength,
  cleanInput
);

const str = " 4444-444-44 ";

console.log(cleanInput(str));

console.log(isValid(str));
