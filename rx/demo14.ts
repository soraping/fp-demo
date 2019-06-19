import { interval, Subject } from "rxjs";
import { multicast, take, refCount } from "rxjs/operators";

const coldSource$ = interval(1000).pipe(take(3));

const subjectFactory = () => {
  console.log("enter subjectFactory");
  return new Subject();
};

const tick$ = coldSource$.pipe(
  multicast(subjectFactory),
  refCount()
);

tick$.subscribe(value => console.log("observer 1: " + value));

setTimeout(() => {
  tick$.subscribe(value => console.log("observer 2: " + value));
}, 5000);
