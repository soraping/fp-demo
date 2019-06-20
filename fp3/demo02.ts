import * as _ from "lodash";

declare global {
  interface String {
    first(n: number): string;
    explode(): RegExpMatchArray | null;
  }
}

String.prototype.first = _.partial(String.prototype.substring, 0);

console.log("hello world".first(3));

String.prototype.explode = _.partial(String.prototype.match, /[\w]/gi);

console.log("abc".explode());
