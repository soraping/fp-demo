import { of } from "rxjs";
import { first } from "rxjs/operators";

of(3, 1, 9, 1, 5, 7)
  .pipe(first(x => x % 2 === 0, -1))
  .subscribe(console.log, null, () => console.log("complete"));
