import { range } from "rxjs";
import { takeWhile } from "rxjs/operators";

range(2, 100)
  .pipe(takeWhile(value => value % 2 === 0))
  .subscribe(console.log, null, () => console.log("complete"));
