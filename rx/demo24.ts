import { interval, forkJoin } from "rxjs";
import { take, map } from "rxjs/operators";

const source1$ = interval(1000).pipe(
  map(x => x + "a"),
  take(1)
);
const source2$ = interval(1000).pipe(
  map(x => x + "b"),
  take(3)
);
forkJoin(source1$, source2$, (a, b) => `${a} and ${b}`).subscribe(
  console.log,
  null,
  () => console.log("complete")
);
