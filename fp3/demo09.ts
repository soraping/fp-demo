import * as R from "ramda";

console.log(R.identity("test"));

const sayX = (x: any) => console.log(`X IS ${x}`);

R.tap(sayX)(100);
