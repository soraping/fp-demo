import * as R from "ramda";
import { IO } from "./io";

const read = (document: HTMLDocument, id: string) => () =>
  document.querySelector(`\#${id}`).innerHTML;

const write = (document: HTMLDocument, id: string) => {
  return (val: any) => {
    document.querySelector(`\#${id}`).innerHTML = val;
  };
};

const readDom = R.curry(read)(document);
const writeDom = R.curry(write)(document);

const changeToLocaleUpperCase = IO.from(readDom("student-name"))
  .map(R.toUpper)
  .map(writeDom("student-name"));

changeToLocaleUpperCase.run();
