import * as _ from "lodash";

let names = ["zhangsan", "list", "wanger", "list", "mazi", "haha", ""];

let newNames = _.chain(names)
  .filter(name => !!name)
  .uniq()
  .map(_.startCase)
  .sort()
  .value();

console.log(newNames);
