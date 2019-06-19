import { timer } from "rxjs";
import { startWith } from "rxjs/operators";

const original$ = timer(0, 1000);

original$
  .pipe(startWith("start"))
  .subscribe(console.log, null, () => console.log("complete"));
