import * as R from "ramda";

const str = "hello fp world";

const explode = (str: string) => str.split(/\s+/);

const count = (arr: string[]) => arr.length;

const countWords = R.compose(
  count,
  explode
);

console.log(countWords(str));
