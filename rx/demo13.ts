import { interval, Subject, throwError } from "rxjs";
import { take, map, catchError } from "rxjs/operators";

const tick$ = interval(1000).pipe(take(10));

const subject = new Subject();

// subject 订阅 Cold Observable
tick$.subscribe(subject);

subject
  .pipe(
    map(x => {
      if (x > 5) {
        throw new Error("value is not 6");
      } else {
        return x;
      }
    }),
    catchError(err => throwError(err))
  )
  .subscribe(
    value => console.log("observer 1: " + value),
    err => console.log("observer 1 on error", err.message)
  );

// Observer 订阅 subject
subject.subscribe(
  value => console.log("observer 2: " + value),
  err => console.log("observer 2 on error: ", err.message)
);
