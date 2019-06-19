import { interval } from "rxjs";
import { take, map, exhaust } from "rxjs/operators";

const interval2$ = interval(700);

const ho$ = interval(1000).pipe(
  take(3),
  map(x =>
    interval2$.pipe(
      map(y => `${x} and ${y}`),
      take(2)
    )
  )
);

const concated$ = ho$.pipe(exhaust());

concated$.subscribe(console.log, null, () => console.log("complete"));
