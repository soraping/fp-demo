import { timer, merge, asapScheduler } from "rxjs";
import { take, map } from "rxjs/operators";

const source1$ = timer(0, 1000).pipe(
  take(4),
  map(x => x + "A")
);

const source2$ = timer(500, 1000).pipe(
  take(4),
  map(x => x + "B")
);

const source3$ = timer(1000, 1000).pipe(
  take(4),
  map(x => x + "C")
);

const concurrent = 2;

merge(source1$, source2$, source3$, concurrent, asapScheduler).subscribe(
  console.log
);
