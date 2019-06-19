import { interval, Subject, concat, of } from "rxjs";
import { take, share } from "rxjs/operators";

const source$ = of("done");

const coldSource$ = interval(1000).pipe(take(3));

const selector = (shared: Subject<any>) => {
  console.log("enter selector");
  return concat(shared, source$);
};

const tick$ = coldSource$.pipe(share());

tick$.subscribe(value => console.log("observer 1: " + value));

setTimeout(() => {
  tick$.subscribe(value => console.log("observer 2: " + value));
}, 5000);
